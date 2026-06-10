import { IMentee } from "./mentee";

export interface IHint {
  id: string;
  content: string;
  createdAt: Date;
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
  hints?: string[];
}

export interface IAddHints {
  hints: string[];
  mentorId: string;
}

export interface IUpdateHints {
  hints: string[];
  mentorId: string;
}
