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

      if (!BACKEND_URL) {
        throw new Error('VITE_BACKEND_URL no configurada. Define esta variable en tu archivo .env');
      }

      console.log('✅ Llamando a backend:', BACKEND_URL);

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
    const maxAttempts = 60; // 5 minutos máximo (60 attempts * 5 seconds)
    const pollInterval = 5000; // 5 segundos
    let attempts = 0;

    /**
     * Fetch con retry automático para cada poll
     */
    const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 2) => {
      let lastError: Error | null = null;

      for (let retry = 0; retry <= maxRetries; retry++) {
        try {
          const response = await fetch(url, options);

          // Si es 5xx, reintentar
          if (response.status >= 500) {
            throw new Error(`Server error: ${response.status}`);
          }

          return response;
        } catch (err) {
          lastError = err as Error;

          if (retry === maxRetries) {
            throw lastError;
          }

          // Esperar antes de reintentar (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, retry), 5000);
          console.log(`⚠️ Retry ${retry + 1}/${maxRetries}, waiting ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }

      throw lastError!;
    };

    const pollOnce = async () => {
      attempts++;
      console.log(`🔄 Polling attempt ${attempts}/${maxAttempts}...`);

      try {
        // ✅ Usar backend para polling con retry
        const { backendUrl: BACKEND_URL } = await import('../lib/config/env');

        if (!BACKEND_URL) {
          throw new Error('VITE_BACKEND_URL no configurada');
        }

        const response = await fetchWithRetry(
          `${BACKEND_URL}/api/generation/cover/status/${taskId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${import.meta.env.VITE_BACKEND_SECRET || 'dev-token'}`
            }
          },
          2 // 2 reintentos por cada poll
        );

        // Si es 404, la generación aún no existe, continuar polling
        if (response.status === 404) {
          if (attempts >= maxAttempts) {
            throw new Error('Cover generation timeout - please try again');
          }
          return null; // Continuar polling
        }

        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error?.message || 'Error checking status');
        }

        const status = data.data?.status;
        const audioUrl = data.data?.audioUrl;

        console.log(`📊 Status: ${status}`);

        // Backend devuelve formato estándar
        if (audioUrl && (status === 'COMPLETED' || status === 'completed')) {
          console.log('✅ Cover completed!');
          return {
            status: 'completed' as const,
            taskId: taskId,
            audio_url: audioUrl
          };
        }

        if (status === 'FAILED' || status === 'failed') {
          throw new Error(data.error?.message || 'Cover generation failed');
        }

        // Status es PROCESSING o PENDING, continuar polling
        if (attempts >= maxAttempts) {
          throw new Error('Cover generation timeout - please try again');
        }

        return null; // Continuar polling

      } catch (err: any) {
        // Solo propagar el error si hemos excedido los intentos
        if (attempts >= maxAttempts) {
          throw err;
        }

        // Si es un error temporal, continuar polling
        console.warn(`⚠️ Polling error (attempt ${attempts}):`, err.message);
        return null;
      }
    };

    // Loop principal de polling
    while (attempts < maxAttempts) {
      try {
        const result = await pollOnce();

        if (result) {
          // Éxito! Actualizar estado y terminar
          setResult(result);
          setIsGenerating(false);

          // Enviar resultado de vuelta a The Generator
          sendResultToGenerator({ audio_url: result.audio_url });
          return;
        }

        // No hay resultado aún, esperar y reintentar
        await new Promise(resolve => setTimeout(resolve, pollInterval));

      } catch (err: any) {
        console.error('❌ Polling failed:', err);
        setError(err.message || 'Error checking cover status');
        setIsGenerating(false);
        return;
      }
    }

    // Si llegamos aquí, timeout
    setError('Cover generation timeout - please try again');
    setIsGenerating(false);
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