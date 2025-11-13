// apps/ghost-studio/src/hooks/useSunoCover.ts
import { useState, useEffect } from 'react';
import { supabaseStorage } from '../lib/api/supabase-storage';
import { translateToEnglish } from '../lib/translate';
import type { CoverResult, GeneratorData } from '@super-son1k/shared-types';
import { useCoverProgress } from './useCoverProgress';

export function useSunoCover() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [result, setResult] = useState<CoverResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatorData, setGeneratorData] = useState<GeneratorData | null>(null);
  
  // WebSocket integration for real-time cover progress
  const { progress: wsProgress, isConnected: wsConnected } = useCoverProgress(taskId);

  // Verificar datos de The Generator al cargar
  useEffect(() => {
    const checkForGeneratorData = () => {
      const data = localStorage.getItem('son1kverse_generator_data');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setGeneratorData(parsed);
          // Limpiar después de leer
          localStorage.removeItem('son1kverse_generator_data');
        } catch (err) {
          console.error('Error parsing generator data:', err);
        }
      }
    };

    checkForGeneratorData();
  }, []);

  const sendResultToGenerator = (data: any) => {
    const resultData = {
      coverUrl: data.audio_url || data.result?.audio_url,
      originalAudio: generatorData?.generatedAudio,
      prompt: generatorData?.style || 'Generated cover',
      taskId: taskId,
      timestamp: Date.now(),
      source: 'ghost-studio'
    };
    
    localStorage.setItem('son1kverse_ghost_result', JSON.stringify(resultData));
  };

  // Update result from WebSocket progress
  useEffect(() => {
    if (wsProgress) {
      if (wsProgress.status === 'completed' && wsProgress.imageUrl) {
        setResult({
          status: 'completed',
          taskId: wsProgress.taskId,
          audio_url: wsProgress.imageUrl
        });
        setIsGenerating(false);
        // Enviar resultado de vuelta a The Generator
        sendResultToGenerator({ audio_url: wsProgress.imageUrl });
      } else if (wsProgress.status === 'failed') {
        setError(wsProgress.error || 'Error generando cover');
        setIsGenerating(false);
      }
    }
  }, [wsProgress, generatorData, taskId]);

  const generateCover = async (audioFile: File, prompt: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // 1. Subir audio a Supabase
      const uploadUrl = await supabaseStorage.uploadAudio(audioFile, 'cover-input');
      if (!uploadUrl || typeof uploadUrl !== 'string') {
        throw new Error('Error uploading audio: Invalid response');
      }

      // 2. Translate prompt to English before sending
      const translatedPrompt = await translateToEnglish(prompt);

      // 3. Llamar al backend propio (que usa pool de tokens)
      const { backendUrl: BACKEND_URL } = await import('../lib/config/env')
      
      // Llamar al backend para generación de cover
      const response = await fetch(`${BACKEND_URL}/api/generation/cover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_BACKEND_SECRET || 'dev-token'}`
        },
        body: JSON.stringify({
          audio_url: uploadUrl,
          prompt: translatedPrompt,
          style: 'cover',
          customMode: true
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Error del servidor' } }))
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Error en la generación');
      }
      
      // Backend ahora devuelve generationId y taskId
      const newTaskId = data.data?.taskId || data.data?.generationTaskId || data.taskId;
      const generationId = data.data?.generationId;
      
      if (!newTaskId) {
        throw new Error('No task ID received from generation API');
      }
      
      setTaskId(newTaskId);
      
      // Guardar generationId si está disponible (para consultas futuras)
      if (generationId) {
        localStorage.setItem(`ghost_cover_${newTaskId}`, generationId);
      }
      
      // 3. Use WebSocket for real-time updates (fallback to polling if not connected)
      // WebSocket updates will be handled by useCoverProgress hook via useEffect
      // Only poll if WebSocket is not available
      if (!wsConnected) {
        pollForResult(newTaskId);
      }
      
    } catch (err: any) {
      console.error('Error generating cover:', err);
      setError(err.message || 'Failed to generate cover');
      setIsGenerating(false);
    }
  };

  const pollForResult = async (taskId: string) => {
    const maxAttempts = 60; // 5 minutos máximo
    let attempts = 0;
    
    const pollInterval = setInterval(async () => {
      attempts++;
      
      try {
          // ✅ Usar backend para polling (endpoint /cover/status/:taskId)
          const { backendUrl: BACKEND_URL } = await import('../lib/config/env')
        
        const response = await fetch(`${BACKEND_URL}/api/generation/cover/status/${taskId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_BACKEND_SECRET || 'dev-token'}`
          }
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            // Generación no encontrada, continuar polling
            if (attempts >= maxAttempts) {
              throw new Error('Cover generation timeout - please try again');
            }
            return; // Continuar polling
          }
          throw new Error(`Status check failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error?.message || 'Error checking status');
        }
        
        // Backend devuelve formato estándar
        if (data.data?.audioUrl && (data.data?.status === 'COMPLETED' || data.data?.status === 'completed')) {
          setResult({
            status: 'completed',
            taskId: taskId,
            audio_url: data.data.audioUrl
          });
          setIsGenerating(false);
          clearInterval(pollInterval);
          
          // Enviar resultado de vuelta a The Generator
          sendResultToGenerator({ audio_url: data.data.audioUrl });
          
        } else if (data.data?.status === 'PROCESSING' || data.data?.status === 'PENDING' || data.data?.status === 'processing' || data.data?.status === 'pending') {
          // Aún procesando, continuar polling
        } else if (data.data?.status === 'FAILED' || data.data?.status === 'failed') {
          throw new Error(data.error?.message || 'Cover generation failed');
        } else if (attempts >= maxAttempts) {
          throw new Error('Cover generation timeout - please try again');
        }
        
      } catch (err: any) {
        console.error('Error polling result:', err);
        setError(err.message || 'Error checking cover status');
        clearInterval(pollInterval);
        setIsGenerating(false);
      }
    }, 5000); // Poll every 5 seconds
  };

  const reset = () => {
    setIsGenerating(false);
    setTaskId(null);
    setResult(null);
    setError(null);
  };

  return { 
    generateCover, 
    isGenerating, 
    taskId, 
    result, 
    error,
    generatorData,
    reset
  };
}