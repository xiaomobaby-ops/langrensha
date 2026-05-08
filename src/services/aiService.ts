import { Role } from '../types/game'
import { Player, IdentityAnalysis, StrategyAdvice } from '../types/player'
import { buildIdentityJudgePrompt } from '../prompts/identityJudge'
import { buildStrategyPrompt } from '../prompts/strategyAdvice'

export type AIService = 'siliconflow' | 'anthropic'

interface AIServiceConfig {
  baseUrl: string;
  model: string;
  apiKey: string;
}

class AIServiceClass {
  private config: AIServiceConfig | null = null

  setService(service: AIService, apiKey: string) {
    if (service === 'siliconflow') {
      this.config = {
        baseUrl: 'https://api.siliconflow.cn/v1',
        model: 'Qwen/Qwen2-7B-Instruct',
        apiKey,
      }
    } else {
      this.config = {
        baseUrl: 'https://api.anthropic.com/v1',
        model: 'claude-3-sonnet-20240229',
        apiKey,
      }
    }
  }

  private async callOpenAICompatible(prompt: string): Promise<string> {
    if (!this.config) {
      throw new Error('请先设置API Key')
    }

    const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 4000,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error?.message || 'API调用失败')
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  private extractJson(text: string): string {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return jsonMatch[0]
    }
    return text
  }

  async analyzeIdentities(
    gameMode: string,
    currentRound: number,
    myRole: Role,
    myPosition: number,
    players: Player[],
    speeches: any[],
    nightInfo?: string
  ): Promise<IdentityAnalysis[]> {
    const prompt = buildIdentityJudgePrompt({
      gameMode,
      currentRound,
      myRole,
      myPosition,
      players,
      speeches,
      nightInfo,
    })

    const response = await this.callOpenAICompatible(prompt)
    const jsonStr = this.extractJson(response)
    const result = JSON.parse(jsonStr)
    return result.analyses
  }

  async getStrategyAdvice(
    myRole: Role,
    myPosition: number,
    currentRound: number,
    players: Player[],
    identityAnalysis: Record<number, IdentityAnalysis>
  ): Promise<StrategyAdvice> {
    const prompt = buildStrategyPrompt({
      myRole,
      myPosition,
      currentRound,
      players,
      identityAnalysis,
    })

    const response = await this.callOpenAICompatible(prompt)
    const jsonStr = this.extractJson(response)
    return JSON.parse(jsonStr)
  }
}

export const aiService = new AIServiceClass()
