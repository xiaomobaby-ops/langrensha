import { useState } from 'react'
import { GameMode, GamePhase, Role, ROLE_NAMES, GAME_MODES } from '../types/game'
import { useGameStore } from '../store/gameStore'

export default function GameSetup() {
  const {
    config, setConfig, setMyRole, setMyPosition, setApiKey,
    initPlayers, setPhase, apiKey, aiService, setAIService
  } = useGameStore()
  const [localApiKey, setLocalApiKey] = useState(apiKey)

  const playerCount = GAME_MODES[config].playerCount

  const handleStart = () => {
    if (localApiKey) {
      setApiKey(localApiKey)
    }
    initPlayers()
    setPhase(GamePhase.NIGHT)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-red-500">🐺 红狼狼人杀AI辅助</h1>

      <div className="space-y-4 md:space-y-6">
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">选择玩法</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <button
              onClick={() => setConfig(GameMode.STANDARD_12)}
              className={`p-4 rounded-lg border-2 transition-all ${
                config === GameMode.STANDARD_12
                  ? 'border-red-500 bg-red-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="font-bold">12人标准局</div>
              <div className="text-sm text-gray-400">4狼4民4神（预女猎白）</div>
            </button>
            <button
              onClick={() => setConfig(GameMode.QUICK_10)}
              className={`p-4 rounded-lg border-2 transition-all ${
                config === GameMode.QUICK_10
                  ? 'border-red-500 bg-red-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="font-bold">10人速推局</div>
              <div className="text-sm text-gray-400">3狼4民3神（预女猎）</div>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">我的位置</h2>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {Array.from({ length: playerCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setMyPosition(n)}
                className={`p-2 md:p-3 rounded-lg font-bold transition-all ${
                  useGameStore.getState().myPosition === n
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {n}号
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">我的身份</h2>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {Object.entries(ROLE_NAMES).map(([role, name]) => (
              <button
                key={role}
                onClick={() => setMyRole(role as Role)}
                className={`p-2 md:p-3 rounded-lg font-bold transition-all text-sm md:text-base ${
                  useGameStore.getState().myRole === role
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">AI服务商</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setAIService('siliconflow')}
              className={`p-3 rounded-lg border-2 transition-all ${
                aiService === 'siliconflow'
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="font-bold">硅基流动（免费）</div>
              <div className="text-sm text-gray-400">Qwen2-7B</div>
            </button>
            <button
              onClick={() => setAIService('anthropic')}
              className={`p-3 rounded-lg border-2 transition-all ${
                aiService === 'anthropic'
                  ? 'border-orange-500 bg-orange-500/20'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="font-bold">Claude（付费）</div>
              <div className="text-sm text-gray-400">Sonnet-3</div>
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-4">API Key</h2>
          <input
            type="password"
            value={localApiKey}
            onChange={(e) => setLocalApiKey(e.target.value)}
            placeholder={aiService === 'siliconflow' ? 'sk-... 硅基流动API Key' : 'sk-ant-... Claude API Key'}
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <p className="text-sm text-gray-400 mt-2">
            {aiService === 'siliconflow'
              ? '硅基流动 Key 到 https://cloud.siliconflow.cn 免费获取'
              : 'API Key仅存在本地，不上传'}
          </p>
        </div>

        <button
          onClick={handleStart}
          disabled={!useGameStore.getState().myPosition || !useGameStore.getState().myRole}
          className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold text-xl transition-all"
        >
          开始游戏
        </button>
      </div>
    </div>
  )
}
