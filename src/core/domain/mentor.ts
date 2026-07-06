import { IHint } from "./hint";
import { IMentee } from "./mentee";

export interface IMentor {
  id: string;
  studentId: string;
  password?: string | null;
  nickname?: string | null;
  isAdmin: boolean;
  point: number;
  unlockedCosmetics: string[];
  equippedEffect: string | null;

  hints: IHint[];

  mentee?: IMentee | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMentor {
  studentId: string;
  nickname?: string | null;
  isAdmin?: boolean;
}
