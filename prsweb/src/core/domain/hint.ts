export interface IHint {
  id: string;
  content: string;
  createdAt: Date;
}

export interface IAddHints {
  mentorId: string;
  hints: string[];
}

export interface IUpdateHints {
  content: string;
}
