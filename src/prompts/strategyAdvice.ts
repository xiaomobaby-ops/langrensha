import { Role, ROLE_NAMES } from '../types/game'
import { Player, IdentityAnalysis } from '../types/player'

interface StrategyInput {
  myRole: Role;
  myPosition: number;
  currentRound: number;
  players: Player[];
  identityAnalysis: Record<number, IdentityAnalysis>;
}

export function buildStrategyPrompt(input: StrategyInput): string {
  const { myRole, myPosition, currentRound, players, identityAnalysis } = input

  const wolfList = players.filter((p) => p.isAlive && !p.isMySelf)
    .sort((a, b) => (identityAnalysis[b.id]?.probability.wolf || 0) - (identityAnalysis[a.id]?.probability.wolf || 0))
    .slice(0, 3)
    .map((p) => `${p.id}号(狼面${identityAnalysis[p.id]?.probability.wolf || 0}%)`)
    .join(', ')

  return `
你是一位红狼口袋狼人杀的顶级职业玩家。你正在玩一局${currentRound > 1 ? `第${currentRound}轮` : '首轮'}游戏，你的身份是${ROLE_NAMES[myRole]}，坐在${myPosition}号位置。

## 狼面最高的玩家
${wolfList}

## 身份分析结果
${players.filter(p => p.isAlive).map(p => {
  const analysis = identityAnalysis[p.id]
  if (!analysis) return ''
  return `${p.id}号: ${analysis.summary}`
}).filter(Boolean).join('\n')}

## 请根据你的身份给出具体策略建议

身份视角说明：
- 【狼人视角】：目标是杀光好人。要考虑：今晚刀谁能最大利益？明天怎么发言才能不被怀疑？冲票还是倒钩？队友配合。
- 【预言家视角】：目标是找出所有狼。要考虑：今晚验谁最有信息量？警徽流怎么留？发言怎么让好人相信你？
- 【女巫视角】：手握双药，信息最多。要考虑：解药还在吗？毒药该毒谁？要不要跳身份？银水怎么处理？
- 【猎人视角】：死后可以开枪。要考虑：藏身份还是跳明？如果死了开枪打谁？
- 【平民视角】：没有技能，只能靠发言。要考虑：怎么表水干净？跟着谁站队？该踩谁该保谁？

请输出JSON格式的策略建议，严格按以下格式返回，不要其他文字：
{
  "role": "${myRole}",
  "speechAdvice": "详细的发言建议（至少200字）：开头怎么说？该踩谁？该保谁？怎么表水？怎么打对立面？要具体，不要笼统。",
  "actionAdvice": "当前轮次的具体行动建议：夜间该操作什么？白天该投票给谁？要不要跳身份？",
  "targetSuggestions": [推荐操作的玩家编号数组，比如刀人目标、验人目标、毒药目标等],
  "warnings": ["需要特别注意的风险点1", "需要特别注意的风险点2"]
}

发言建议要求非常具体，要有红狼玩法的风格，要适合当前轮次的发言套路。
`
}
