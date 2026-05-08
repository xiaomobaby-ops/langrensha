import { Role, ROLE_NAMES } from '../types/game'
import { Player, Speech } from '../types/player'

interface IdentityJudgeInput {
  gameMode: string;
  currentRound: number;
  myRole: Role;
  myPosition: number;
  players: Player[];
  speeches: Speech[];
  nightInfo?: string;
}

export function buildIdentityJudgePrompt(input: IdentityJudgeInput): string {
  const { gameMode, currentRound, myRole, myPosition, players, speeches, nightInfo } = input

  const playersInfo = players
    .map((p) => {
      const roleInfo = p.isMySelf && p.actualRole ? `(我的身份: ${ROLE_NAMES[p.actualRole]})` : ''
      const status = p.isAlive ? '存活' : '已死亡'
      return `${p.id}号玩家${roleInfo} - ${status}`
    })
    .join('\n')

  const speechesInfo = speeches
    .map((s) => {
      const player = players.find((p) => p.id === s.playerId)
      const tags = s.tags.length > 0 ? `[标记: ${s.tags.join(', ')}]` : ''
      return `【第${s.round}轮 - ${player?.id}号发言】${tags}\n${s.content}\n`
    })
    .join('\n')

  return `
你是一位专业的红狼口袋狼人杀法官和分析师。请根据以下游戏信息，分析每位玩家的身份倾向。

## 游戏配置
- 玩法: ${gameMode}
- 当前轮次: 第${currentRound}轮
- 我的身份: ${ROLE_NAMES[myRole]} (${myPosition}号)

## 玩家列表
${playersInfo}

${nightInfo ? `## 夜间信息（仅我可见）\n${nightInfo}\n` : ''}

## 完整发言记录
${speechesInfo}

## 分析要求（非常重要）
基于红狼口袋狼人杀的玩法特点进行分析：
1. 红狼玩家通常发言比较激进，喜欢带队踩人
2. 红狼玩家经常会有"身份定义式发言"，强行给其他玩家定身份
3. 红狼玩家容易出现发言前后矛盾，或者视角异常
4. 预言家发言通常比较真诚，有完整验人逻辑和警徽流
5. 神牌发言通常比较自信，不怕扛推
6. 平民发言通常比较谨慎，不敢轻易定死身份

请为每位存活玩家输出JSON格式的分析结果，严格按以下格式返回，不要其他文字：
{
  "analyses": [
    {
      "playerId": 玩家编号,
      "summary": "一句话身份总结",
      "keyPoints": ["关键分析点1", "关键分析点2"],
      "contradictions": ["矛盾点1", "矛盾点2"],
      "probability": {
        "wolf": 0-100,
        "prophet": 0-100,
        "witch": 0-100,
        "hunter": 0-100,
        "idiot": 0-100,
        "villager": 0-100
      }
    }
  ]
}

概率要求：每个玩家6项概率之和必须等于100。
只分析存活玩家，不要分析已死亡玩家。
`
}
