import { useGameStore } from '../store/gameStore'
import { useAIStore } from '../store/aiStore'
import { aiService } from '../services/aiService'

export default function AIAnalysis() {
  const { config, currentRound, myRole, myPosition, players, speeches, apiKey, aiService: service } = useGameStore()
  const { isAnalyzing, identityAnalysis, setAnalyzing, setIdentityAnalysis, setError, setStrategyAdvice } = useAIStore()

  const handleAnalyze = async () => {
    if (!apiKey || !myRole || !myPosition) return

    aiService.setService(service, apiKey)
    setAnalyzing(true)
    setError(null)

    try {
      const modeName = config === 'standard_12' ? '12人标准局' : '10人速推局'
      const analyses = await aiService.analyzeIdentities(
        modeName,
        currentRound,
        myRole,
        myPosition,
        players,
        speeches
      )
      setIdentityAnalysis(analyses)

      const advice = await aiService.getStrategyAdvice(
        myRole,
        myPosition,
        currentRound,
        players,
        analyses.reduce((acc, a) => ({ ...acc, [a.playerId]: a }), {})
      )
      setStrategyAdvice(advice)
    } catch (err: any) {
      setError(err.message || '分析失败')
    } finally {
      setAnalyzing(false)
    }
  }

  const alivePlayers = players.filter((p) => p.isAlive && !p.isMySelf)

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">AI身份分析</h2>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || speeches.length === 0}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold transition-all"
        >
          {isAnalyzing ? '分析中...' : '🔮 开始分析'}
        </button>
      </div>

      {Object.keys(identityAnalysis).length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alivePlayers.map((player) => {
            const analysis = identityAnalysis[player.id]
            if (!analysis) return null

            return (
              <div key={player.id} className="p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{player.id}号</span>
                  <span className="text-red-400 text-sm font-bold">
                    狼面 {analysis.probability.wolf}%
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-2">{analysis.summary}</p>
                {analysis.keyPoints.length > 0 && (
                  <div className="text-xs text-gray-400">
                    关键: {analysis.keyPoints.join(' | ')}
                  </div>
                )}
                {analysis.contradictions.length > 0 && (
                  <div className="text-xs text-red-400 mt-1">
                    ⚠️ 矛盾: {analysis.contradictions.join(' | ')}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {Object.keys(identityAnalysis).length === 0 && !isAnalyzing && (
        <div className="text-gray-400 text-center py-8">
          录入至少1轮发言后，点击开始分析
        </div>
      )}
    </div>
  )
}
