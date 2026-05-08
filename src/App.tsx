import { useGameStore } from './store/gameStore'
import GameSetup from './components/GameSetup'
import PlayerPanel from './components/PlayerPanel'
import SpeechInput from './components/SpeechInput'
import AIAnalysis from './components/AIAnalysis'
import StrategyAdvice from './components/StrategyAdvice'
import { GamePhase } from './types/game'

export default function App() {
  const { phase, currentRound, nextRound, resetGame, setPhase } = useGameStore()

  if (phase === GamePhase.SETUP) {
    return <GameSetup />
  }

  return (
    <div className="min-h-screen bg-gray-900 p-2 md:p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-red-500">🐺 红狼狼人杀AI辅助</h1>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 bg-gray-800 rounded-full font-bold text-sm">
            第 {currentRound} 轮
          </span>
          <button
            onClick={() => setPhase(phase === GamePhase.NIGHT ? GamePhase.DAY : GamePhase.NIGHT)}
            className={`px-3 py-1 rounded-lg font-bold transition-all text-sm ${
              phase === GamePhase.NIGHT ? 'bg-gray-800 text-blue-400' : 'bg-gray-800 text-yellow-400'
            }`}
          >
            {phase === GamePhase.NIGHT ? '🌙 夜间' : '☀️ 白天'}
          </button>
          <button
            onClick={nextRound}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all text-sm"
          >
            下一轮
          </button>
          <button
            onClick={resetGame}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-all text-sm"
          >
            重新开始
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-3">
          <PlayerPanel />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <SpeechInput />
          <AIAnalysis />
        </div>

        <div className="lg:col-span-4">
          <StrategyAdvice />
        </div>
      </div>
    </div>
  )
}
