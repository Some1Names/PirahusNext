import { IMentee } from "./mentee";
import { IHint } from "./hint";

export interface IMentor {
  id: string;
  studentId: string;
  nickname?: string | null;
  isAdmin: boolean;
  point: number;

  hints: IHint[];

  mentee: IMentee | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMentor {
  studentId: string;
  nickname?: string | null;
  isAdmin?: boolean;
}
