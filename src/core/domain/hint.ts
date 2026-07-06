export interface IHint {
  id: string;
  mentorId: string;
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
  content: string | null;
  level: number;
  cost: number;
  isUnlocked: boolean;
}

export interface IUnlockHintResult {
  hint: {
    id: string;
    level: number;
    content: string;
  };
  newPoint: number;
}
