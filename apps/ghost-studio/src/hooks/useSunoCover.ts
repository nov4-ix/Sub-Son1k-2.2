// apps/ghost-studio/src/hooks/useSunoCover.ts
import { useState, useEffect } from 'react';
import { supabaseStorage } from '../lib/api/supabase-storage';
import type { CoverResult, GeneratorData } from '@super-son1k/shared-types';

export function useSunoCover() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [result, setResult] = useState<CoverResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatorData, setGeneratorData] = useState<GeneratorData | null>(null);

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

  const generateCover = async (audioFile: File, prompt: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // 1. Subir audio a Supabase
      const uploadUrl = await supabaseStorage.uploadAudio(audioFile, 'cover-input');
      if (!uploadUrl || typeof uploadUrl !== 'string') {
        throw new Error('Error uploading audio: Invalid response');
      }

      // 2. Llamar al backend propio (que usa pool de tokens)
      const BACKEND_FALLBACK = 'https://backend-jo27sb8hr-son1kvers3s-projects-c3cdfb54.vercel.app'
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || BACKEND_FALLBACK
      
      // Intentar primero con backend propio
      let response
      try {
        response = await fetch(`${BACKEND_URL}/api/generation/cover`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_BACKEND_SECRET || 'dev-token'}`
          },
          body: JSON.stringify({
            audio_url: uploadUrl,
            prompt: prompt,
            style: 'cover',
            customMode: true
          })
        })
        
        // Si backend no tiene endpoint de cover, usar directamente
        if (!response.ok && response.status === 404) {
          throw new Error('Cover endpoint not available')
        }
      } catch (error) {
        // ❌ SEGURIDAD: NUNCA usar tokens API directamente desde el frontend
        // Si el backend no está disponible, mostrar error claro al usuario
        console.error('Backend no disponible:', error)
        throw new Error(
          'El servicio de generación no está disponible en este momento. ' +
          'Por favor, contacta al administrador o intenta más tarde.'
        )
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newTaskId = data.data?.taskId || data.taskId;
      
      if (!newTaskId) {
        throw new Error('No task ID received from Suno Cover API');
      }
      
      setTaskId(newTaskId);
      
      // 3. Iniciar polling para obtener resultado
      pollForResult(newTaskId);
      
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
        // ✅ Usar backend para polling en lugar de token directo
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://son1kverse-backend.railway.app'
        const response = await fetch(`${BACKEND_URL}/api/generation/status/${taskId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_BACKEND_SECRET || 'dev-token'}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        // ai.imgkits.com devuelve { running: true/false, audio_url, ... }
        if (data.running === false && data.audio_url) {
          setResult({
            status: 'completed',
            taskId: taskId,
            audio_url: data.audio_url
          });
          setIsGenerating(false);
          clearInterval(pollInterval);
          
          // Enviar resultado de vuelta a The Generator
          sendResultToGenerator(data);
          
        } else if (data.running === true) {
          // Aún procesando, continuar polling
        } else if (data.error || (data.status === 'failed' || data.status === 'error')) {
          throw new Error(data.error || 'Cover generation failed');
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