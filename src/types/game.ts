export enum GameMode {
  STANDARD_12 = 'standard_12',
  QUICK_10 = 'quick_10',
  CUSTOM = 'custom',
}

export enum Role {
  VILLAGER = 'villager',
  WOLF = 'wolf',
  PROPHET = 'prophet',
  WITCH = 'witch',
  HUNTER = 'hunter',
  IDIOT = 'idiot',
}

export enum GamePhase {
  SETUP = 'setup',
  NIGHT = 'night',
  DAY = 'day',
  VOTING = 'voting',
  ENDED = 'ended',
}

export enum SpeechTag {
  JUMP_PROPHET = 'jump_prophet',
  ACCUSE = 'accuse',
  DEFEND = 'defend',
  VOTE = 'vote',
  SELF_REPORT = 'self_report',
  WOLF_BEHAVIOR = 'wolf_behavior',
}

export interface GameConfig {
  mode: GameMode;
  playerCount: number;
  roles: Record<Role, number>;
}

export interface Speech {
  id: string;
  playerId: number;
  round: number;
  content: string;
  tags: SpeechTag[];
  timestamp: number;
}

export interface VoteRecord {
  round: number;
  from: number;
  to: number;
}

export interface NightAction {
  round: number;
  type: 'kill' | 'save' | 'poison' | 'check';
  actor: number;
  target: number;
}

export const ROLE_NAMES: Record<Role, string> = {
  [Role.VILLAGER]: '平民',
  [Role.WOLF]: '狼人',
  [Role.PROPHET]: '预言家',
  [Role.WITCH]: '女巫',
  [Role.HUNTER]: '猎人',
  [Role.IDIOT]: '白痴',
}

export const GAME_MODES: Record<GameMode, GameConfig> = {
  [GameMode.STANDARD_12]: {
    mode: GameMode.STANDARD_12,
    playerCount: 12,
    roles: {
      [Role.WOLF]: 4,
      [Role.VILLAGER]: 4,
      [Role.PROPHET]: 1,
      [Role.WITCH]: 1,
      [Role.HUNTER]: 1,
      [Role.IDIOT]: 1,
    },
  },
  [GameMode.QUICK_10]: {
    mode: GameMode.QUICK_10,
    playerCount: 10,
    roles: {
      [Role.WOLF]: 3,
      [Role.VILLAGER]: 4,
      [Role.PROPHET]: 1,
      [Role.WITCH]: 1,
      [Role.HUNTER]: 1,
      [Role.IDIOT]: 0,
    },
  },
  [GameMode.CUSTOM]: {
    mode: GameMode.CUSTOM,
    playerCount: 0,
    roles: {} as Record<Role, number>,
  },
}
