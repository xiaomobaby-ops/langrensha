import { useGameStore } from '../store/gameStore'
import { useAIStore } from '../store/aiStore'
import { ROLE_NAMES } from '../types/game'

export default function PlayerPanel() {
  const { players, currentSpeaker, setCurrentSpeaker, killPlayer } = useGameStore()
  const { identityAnalysis } = useAIStore()

  const getRoleColor = (prob: number | undefined) => {
    if (!prob) return 'bg-gray-700'
    if (prob >= 60) return 'bg-red-600'
    if (prob >= 40) return 'bg-red-400'
    if (prob >= 20) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">玩家状态</h2>
      <div className="grid grid-cols-3 gap-2">
        {players.map((player) => {
          const analysis = identityAnalysis[player.id]
          const wolfProb = analysis?.probability.wolf || 0

          return (
            <div
              key={player.id}
              onClick={() => !player.isAlive ? killPlayer(player.id) : setCurrentSpeaker(player.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                currentSpeaker === player.id
                  ? 'ring-2 ring-blue-500 bg-blue-900/50'
                  : player.isAlive
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-900 opacity-50'
              } ${player.isMySelf ? 'border-2 border-purple-500' : ''}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold">{player.id}号</span>
                {player.isMySelf && player.actualRole && (
                  <span className="text-xs text-purple-400">{ROLE_NAMES[player.actualRole]}</span>
                )}
              </div>

              {player.isAlive && wolfProb > 0 && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>狼面</span>
                    <span className="text-red-400">{wolfProb}%</span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${getRoleColor(wolfProb)}`}
                      style={{ width: `${wolfProb}%` }}
                    />
                  </div>
                </div>
              )}

              {!player.isAlive && (
                <div className="text-red-500 text-sm mt-1 font-bold">已死亡</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
