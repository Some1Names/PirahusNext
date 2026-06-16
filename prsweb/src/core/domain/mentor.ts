import { IMentee } from "./mentee";
import { IHint } from "./hint";

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
