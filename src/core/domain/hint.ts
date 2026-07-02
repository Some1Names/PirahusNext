export interface IHint {
  id: string;
  content: string;
  level: number;
  createdAt: Date;
}

export interface IAddHints {
  mentorId: string;
  hints: { content: string; level: number }[];
}

export interface IUpdateHints {
  content: string;
}

export interface IMenteeHint {
  id: string;
  level: number;
  cost: number;
  isUnlocked: boolean;
  content: string | null;
}

export interface IUnlockHintResult {
  hint: {
    id: string;
    level: number;
    content: string;
  };
  newPoint: number;
}
