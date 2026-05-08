import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameMode, GamePhase, Role, Speech, SpeechTag, VoteRecord, NightAction, GAME_MODES } from '../types/game'
import { Player } from '../types/player'

interface GameState {
  phase: GamePhase;
  currentRound: number;
  currentSpeaker: number | null;
  config: GameMode;
  myRole: Role | null;
  myPosition: number | null;
  players: Player[];
  speeches: Speech[];
  votes: VoteRecord[];
  nightActions: NightAction[];
  sheriff: number | null;
  apiKey: string;
  aiService: 'siliconflow' | 'anthropic';

  setPhase: (phase: GamePhase) => void;
  setConfig: (config: GameMode) => void;
  setMyRole: (role: Role | null) => void;
  setMyPosition: (pos: number | null) => void;
  setApiKey: (key: string) => void;
  setAIService: (service: 'siliconflow' | 'anthropic') => void;
  initPlayers: () => void;
  updatePlayer: (id: number, updates: Partial<Player>) => void;
  addSpeech: (speech: Omit<Speech, 'id' | 'timestamp'>) => void;
  addTagToSpeech: (speechId: string, tag: SpeechTag) => void;
  addVote: (vote: VoteRecord) => void;
  addNightAction: (action: NightAction) => void;
  setCurrentSpeaker: (id: number | null) => void;
  nextRound: () => void;
  killPlayer: (id: number) => void;
  setSheriff: (id: number | null) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      phase: GamePhase.SETUP,
      currentRound: 1,
      currentSpeaker: null,
      config: GameMode.STANDARD_12,
      myRole: null,
      myPosition: null,
      players: [],
      speeches: [],
      votes: [],
      nightActions: [],
      sheriff: null,
      apiKey: '',
      aiService: 'siliconflow',

      setPhase: (phase) => set({ phase }),
      setConfig: (config) => set({ config }),
      setMyRole: (role) => set({ myRole: role }),
      setMyPosition: (pos) => set({ myPosition: pos }),
      setApiKey: (apiKey) => set({ apiKey }),
      setAIService: (service) => set({ aiService: service }),

      initPlayers: () => {
        const config = GAME_MODES[get().config]
        const players: Player[] = Array.from({ length: config.playerCount }, (_, i) => ({
          id: i + 1,
          name: `${i + 1}号`,
          isAlive: true,
          isMySelf: false,
          tags: [],
        }))
        const myPos = get().myPosition
        if (myPos && get().myRole) {
          players[myPos - 1].isMySelf = true
          players[myPos - 1].actualRole = get().myRole as Role
        }
        set({ players })
      },

      updatePlayer: (id, updates) => {
        set((state) => ({
          players: state.players.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }))
      },

      addSpeech: (speech) => {
        set((state) => ({
          speeches: [
            ...state.speeches,
            {
              ...speech,
              id: Date.now().toString(),
              timestamp: Date.now(),
            },
          ],
        }))
      },

      addTagToSpeech: (speechId, tag) => {
        set((state) => ({
          speeches: state.speeches.map((s) =>
            s.id === speechId && !s.tags.includes(tag)
              ? { ...s, tags: [...s.tags, tag] }
              : s
          ),
        }))
      },

      addVote: (vote) => set((state) => ({ votes: [...state.votes, vote] })),
      addNightAction: (action) => set((state) => ({ nightActions: [...state.nightActions, action] })),
      setCurrentSpeaker: (id) => set({ currentSpeaker: id }),

      nextRound: () => {
        set((state) => ({ currentRound: state.currentRound + 1 }))
      },

      killPlayer: (id) => {
        set((state) => ({
          players: state.players.map((p) =>
            p.id === id ? { ...p, isAlive: false } : p
          ),
        }))
      },

      setSheriff: (id) => set({ sheriff: id }),

      resetGame: () => {
        set({
          phase: GamePhase.SETUP,
          currentRound: 1,
          currentSpeaker: null,
          myRole: null,
          myPosition: null,
          players: [],
          speeches: [],
          votes: [],
          nightActions: [],
          sheriff: null,
        })
      },
    }),
    {
      name: 'werewolf-game-storage',
    }
  )
)
