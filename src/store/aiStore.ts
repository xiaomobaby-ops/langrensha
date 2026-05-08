import { create } from 'zustand'
import { IdentityAnalysis, StrategyAdvice } from '../types/player'

interface AIState {
  isAnalyzing: boolean;
  identityAnalysis: Record<number, IdentityAnalysis>;
  strategyAdvice: StrategyAdvice | null;
  analysisError: string | null;

  setAnalyzing: (val: boolean) => void;
  setIdentityAnalysis: (analysis: IdentityAnalysis[]) => void;
  setStrategyAdvice: (advice: StrategyAdvice | null) => void;
  setError: (err: string | null) => void;
  resetAI: () => void;
}

export const useAIStore = create<AIState>((set) => ({
  isAnalyzing: false,
  identityAnalysis: {},
  strategyAdvice: null,
  analysisError: null,

  setAnalyzing: (val) => set({ isAnalyzing: val }),

  setIdentityAnalysis: (analyses) => {
    const map: Record<number, IdentityAnalysis> = {}
    analyses.forEach((a) => {
      map[a.playerId] = a
    })
    set({ identityAnalysis: map })
  },

  setStrategyAdvice: (advice) => set({ strategyAdvice: advice }),
  setError: (err) => set({ analysisError: err }),

  resetAI: () => {
    set({
      isAnalyzing: false,
      identityAnalysis: {},
      strategyAdvice: null,
      analysisError: null,
    })
  },
}))
