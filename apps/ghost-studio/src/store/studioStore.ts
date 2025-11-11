import { create } from 'zustand';
import type { AnalysisResult } from '../types/studio';

interface StudioState {
  audioBuffer: AudioBuffer | null;
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  setAudioBuffer: (buffer: AudioBuffer | null) => void;
  setAudioUrl: (url: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  setAnalysis: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  audioBuffer: null,
  audioUrl: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  analysisResult: null,
  isAnalyzing: false,
  setAudioBuffer: (buffer: AudioBuffer | null) => set({ audioBuffer: buffer }),
  setAudioUrl: (url: string | null) => set({ audioUrl: url }),
  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setCurrentTime: (time: number) => set({ currentTime: time }),
  setDuration: (duration: number) => set({ duration }),
  setAnalysisResult: (result: AnalysisResult | null) => set({ analysisResult: result }),
  setAnalysis: (result: AnalysisResult | null) => set({ analysisResult: result }),
  setIsAnalyzing: (analyzing: boolean) => set({ isAnalyzing: analyzing }),
}));

