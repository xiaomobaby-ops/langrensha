import { Role } from './game'

export interface Player {
  id: number;
  name: string;
  isAlive: boolean;
  actualRole?: Role;
  predictedRole?: Role;
  roleProbability?: RoleProbability;
  isMySelf: boolean;
  tags: string[];
}

export interface RoleProbability {
  wolf: number;
  prophet: number;
  witch: number;
  hunter: number;
  idiot: number;
  villager: number;
}

export interface IdentityAnalysis {
  playerId: number;
  summary: string;
  keyPoints: string[];
  contradictions: string[];
  probability: RoleProbability;
}

export interface StrategyAdvice {
  role: Role;
  speechAdvice: string;
  actionAdvice: string;
  targetSuggestions: number[];
  warnings: string[];
}
