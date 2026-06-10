import { IMentee } from "./mentee";

export interface IHint {
  id: string;
  content: string;
  createdAt: Date;
}

export interface IUpdateHintItem {
  id: string;
  content: string;
}

export interface IMentor {
  id: string;
  studentId: string;

  hints: IHint[];

  mentee: IMentee | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMentor {
  studentId: string;
}

export interface IUpdateMentor {
  id: string;
  hints?: IUpdateHintItem[];
}

export interface IAddHints {
  hints: string[];
}

export interface IUpdateHints {
  hints: IUpdateHintItem[];
}
