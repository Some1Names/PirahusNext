export interface IHint {
  id: string;
  content: string;
  createdAt: Date;
}

export interface IAddHints {
  mentorId: string;
  hints: string[];
}

export interface IUpdateHintItem {
  id: string;
  content: string;
}

export interface IUpdateHints {
  hints: IUpdateHintItem[];
}
