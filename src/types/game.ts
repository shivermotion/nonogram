export enum CellState {
  EMPTY = 0,
  FILLED = 1,
  MARKED = 2, // X mark to indicate definitely empty
}

export enum GameState {
  PLAYING = 'playing',
  WON = 'won',
  PAUSED = 'paused',
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert',
}

export enum Category {
  ANIMALS = 'animals',
  OBJECTS = 'objects',
  NATURE = 'nature',
  FOOD = 'food',
  VEHICLES = 'vehicles',
  ABSTRACT = 'abstract',
  EDUCATIONAL = 'educational',
}

export type GridSize = {
  width: number;
  height: number;
};

export type Clue = number[];

export type Grid = CellState[][];

export type Solution = boolean[][];

export type Position = {
  row: number;
  col: number;
};

export interface NonogramPuzzle {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  size: GridSize;
  solution: Solution;
  rowClues: Clue[];
  colClues: Clue[];
  description?: string;
}

export interface GameSession {
  puzzleId: string;
  currentGrid: Grid;
  startTime: number;
  elapsedTime: number;
  hintsUsed: number;
  state: GameState;
  isCompleted: boolean;
  completionTime?: number;
}

export interface GameStats {
  puzzlesCompleted: number;
  totalPlayTime: number;
  hintsUsed: number;
  averageCompletionTime: number;
  bestTime: number;
  currentStreak: number;
  longestStreak: number;
  completedByDifficulty: Record<Difficulty, number>;
  completedByCategory: Record<Category, number>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface UserProfile {
  id: string;
  username?: string;
  stats: GameStats;
  achievements: Achievement[];
  preferences: {
    theme: 'light' | 'dark';
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    showTimer: boolean;
    autoMarkObvious: boolean;
  };
}

export interface HintResult {
  type: 'cell' | 'row' | 'column' | 'completion';
  position?: Position;
  message: string;
}

export interface GameAction {
  type: 'FILL' | 'MARK' | 'EMPTY' | 'HINT' | 'RESET' | 'PAUSE' | 'RESUME';
  position?: Position;
  timestamp: number;
}
