import { useAIStore } from '../store/aiStore'
import { ROLE_NAMES } from '../types/game'

export default function StrategyAdvice() {
  const { strategyAdvice } = useAIStore()

  if (!strategyAdvice) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <h2 className="text-lg font-bold mb-4">策略建议</h2>
        <div className="text-gray-400 text-center py-8">
          AI分析完成后显示策略建议
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">
        📋 {ROLE_NAMES[strategyAdvice.role]}策略建议
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-blue-400 mb-2">发言建议</h3>
          <div className="p-3 bg-gray-700 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
            {strategyAdvice.speechAdvice}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-green-400 mb-2">行动建议</h3>
          <div className="p-3 bg-gray-700 rounded-lg text-sm">
            {strategyAdvice.actionAdvice}
          </div>
        </div>

        {strategyAdvice.targetSuggestions.length > 0 && (
          <div>
            <h3 className="font-bold text-yellow-400 mb-2">推荐目标</h3>
            <div className="flex gap-2">
              {strategyAdvice.targetSuggestions.map((id) => (
                <span key={id} className="px-3 py-1 bg-yellow-600 rounded-full text-sm font-bold">
                  {id}号
                </span>
              ))}
            </div>
          </div>
        )}

        {strategyAdvice.warnings.length > 0 && (
          <div>
            <h3 className="font-bold text-red-400 mb-2">⚠️ 注意事项</h3>
            <ul className="space-y-1">
              {strategyAdvice.warnings.map((warning, i) => (
                <li key={i} className="text-sm text-red-300">• {warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
