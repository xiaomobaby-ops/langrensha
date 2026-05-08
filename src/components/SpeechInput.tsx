import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { SpeechTag } from '../types/game'

const SPEECH_TAGS = [
  { value: SpeechTag.JUMP_PROPHET, label: '跳预言家' },
  { value: SpeechTag.ACCUSE, label: '踩人' },
  { value: SpeechTag.DEFEND, label: '保人' },
  { value: SpeechTag.VOTE, label: '投票' },
  { value: SpeechTag.SELF_REPORT, label: '表水' },
  { value: SpeechTag.WOLF_BEHAVIOR, label: '狼行为' },
]

export default function SpeechInput() {
  const { currentSpeaker, currentRound, addSpeech, speeches, players } = useGameStore()
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<SpeechTag[]>([])

  const player = players.find((p) => p.id === currentSpeaker)

  const handleSubmit = () => {
    if (!currentSpeaker || !content.trim()) return

    addSpeech({
      playerId: currentSpeaker,
      round: currentRound,
      content: content.trim(),
      tags: selectedTags,
    })

    setContent('')
    setSelectedTags([])
  }

  const toggleTag = (tag: SpeechTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const playerSpeeches = speeches.filter((s) => s.playerId === currentSpeaker)

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-lg font-bold mb-4">
        发言录入 - {player ? `${player.id}号玩家` : '请选择玩家'}
      </h2>

      {currentSpeaker ? (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {SPEECH_TAGS.map((tag) => (
              <button
                key={tag.value}
                onClick={() => toggleTag(tag.value)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedTags.includes(tag.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="输入或粘贴发言内容..."
            className="w-full h-32 p-3 rounded-lg bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
          />

          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="mt-4 w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-bold transition-all"
          >
            保存发言
          </button>

          {playerSpeeches.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold mb-2">历史发言</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {playerSpeeches.map((speech) => (
                  <div key={speech.id} className="p-3 bg-gray-700 rounded-lg">
                    <div className="text-xs text-gray-400 mb-1">
                      第{speech.round}轮
                      {speech.tags.length > 0 && (
                        <span className="ml-2">
                          {speech.tags.map((t) => SPEECH_TAGS.find(st => st.value === t)?.label).join(', ')}
                        </span>
                      )}
                    </div>
                    <div className="text-sm">{speech.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-gray-400 text-center py-8">
          点击左侧玩家卡片选择当前发言人
        </div>
      )}
    </div>
  )
}
