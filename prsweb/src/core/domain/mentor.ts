import { IMentee } from "./mentee";
import { IHint } from "./hint";

export interface IMentor {
  id: string;
  studentId: string;
  name?: string | null;

  hints: IHint[];

  mentee: IMentee | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMentor {
  studentId: string;
  name?: string | null;
}
