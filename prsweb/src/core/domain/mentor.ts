import { IMentee } from "./mentee";

export interface IMentor {
  id: string;
  studentId: string;

  hints: string[];

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
  id: string;
  hints: string[];
}

export interface IUpdateHints {
  id: string;
  hints: string[];
}
