'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Sparkles, Copy, Check, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface LyricGeneratorProps {
  onLyricsGenerated?: (lyrics: string) => void;
  analysis?: any;
  knobs?: any;
}

export default function LyricGenerator({ 
  onLyricsGenerated,
  analysis,
  knobs 
}: LyricGeneratorProps) {
  const [lyricsInput, setLyricsInput] = useState('');
  const [generatedLyrics, setGeneratedLyrics] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLyrics = async () => {
    if (!lyricsInput.trim()) {
      toast.error('Escribe algunas palabras o ideas primero');
      return;
    }

    setIsGenerating(true);
    try {
      // Construir prompt para generación de letras
      let prompt = lyricsInput.trim();
      
      // Agregar contexto del análisis si está disponible
      if (analysis) {
        if (analysis.genre && analysis.genre !== 'unknown') {
          prompt += `, estilo ${analysis.genre}`;
        }
        if (analysis.bpm) {
          prompt += `, tempo ${analysis.bpm} BPM`;
        }
      }
      
      // Agregar contexto de knobs (mood)
      if (knobs) {
        const exp = knobs.expressivity;
        if (exp <= 20) prompt += ', mood triste y melancólico';
        else if (exp <= 40) prompt += ', mood calmado';
        else if (exp <= 60) prompt += ', mood equilibrado';
        else if (exp <= 80) prompt += ', mood alegre y energético';
        else prompt += ', mood euforico';
      }

      // Llamar a API de generación de letras (usar backend o API externa)
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://son1kverse-backend.railway.app';
      
      // Intentar usar endpoint del backend si existe
      const response = await fetch(`${BACKEND_URL}/api/generation/lyrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: prompt,
          context: {
            analysis,
            knobs
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const lyrics = data.lyrics || data.text || '';
        setGeneratedLyrics(lyrics);
        onLyricsGenerated?.(lyrics);
        toast.success('Letra generada exitosamente');
      } else {
        // Fallback: Generación básica local
        const basicLyrics = generateBasicLyrics(lyricsInput, analysis, knobs);
        setGeneratedLyrics(basicLyrics);
        onLyricsGenerated?.(basicLyrics);
        toast.success('Letra generada (modo básico)');
      }
    } catch (error) {
      console.error('Error generating lyrics:', error);
      // Fallback: Generación básica local
      const basicLyrics = generateBasicLyrics(lyricsInput, analysis, knobs);
      setGeneratedLyrics(basicLyrics);
      onLyricsGenerated?.(basicLyrics);
      toast.success('Letra generada (modo básico)');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBasicLyrics = (input: string, analysis?: any, knobs?: any): string => {
    // Generación básica de estructura de letra
    const mood = knobs?.expressivity <= 30 ? 'triste' : knobs?.expressivity >= 70 ? 'alegre' : 'neutral';
    
    return `[Verse 1]
${input}
Reflexionando sobre el tiempo
Buscando un nuevo camino
Encontrando mi destino

[Chorus]
Esta es mi canción
Mi voz, mi emoción
Cantando con el corazón
Esta es mi canción

[Verse 2]
${input}
Caminando hacia adelante
Sin mirar atrás
Construyendo mi futuro
Sin temor ni más

[Chorus]
Esta es mi canción
Mi voz, mi emoción
Cantando con el corazón
Esta es mi canción

[Bridge]
Un momento de paz
Un instante de verdad
Donde todo cobra sentido
Y puedo ser yo

[Chorus]
Esta es mi canción
Mi voz, mi emoción
Cantando con el corazón
Esta es mi canción`;
  };

  const copyLyrics = async () => {
    if (!generatedLyrics) return;
    
    try {
      await navigator.clipboard.writeText(generatedLyrics);
      setCopied(true);
      toast.success('Letra copiada');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple to-mint rounded-lg flex items-center justify-center">
          <Music className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-lavender">Generador de Letras</h3>
          <p className="text-xs text-gray-400">Escribe ideas o genera letra completa</p>
        </div>
      </div>

      <textarea
        placeholder="Escribe palabras, ideas, emociones, temas... La IA generará una letra completa basada en esto."
        className="input-glass min-h-[120px]"
        value={lyricsInput}
        onChange={(e) => setLyricsInput(e.target.value)}
      />

      <button
        onClick={generateLyrics}
        disabled={isGenerating || !lyricsInput.trim()}
        className="btn-neon purple w-full py-3 rounded-lg flex items-center justify-center gap-2"
      >
        {isGenerating ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generar Letra
          </>
        )}
      </button>

      {generatedLyrics && (
        <div className="p-4 bg-bg-card rounded-lg border border-teal-dark space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-2">Letra Generada:</p>
              <pre className="text-sm text-mint font-mono whitespace-pre-wrap">
                {generatedLyrics}
              </pre>
            </div>
            <button
              onClick={copyLyrics}
              className="ml-2 p-1.5 rounded-lg bg-bg-secondary hover:bg-bg-secondary/80 transition-colors"
              title="Copiar letra"
            >
              {copied ? (
                <Check className="w-4 h-4 text-mint" />
              ) : (
                <Copy className="w-4 h-4 text-lavender" />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

