import { IMentor } from "./mentor";

export interface IMentee {
  id: string;
  studentId: string;
  password?: string | null;
  nickname?: string | null;
  point: number;
  unlockedHintLevels: number[];
  unlockedCosmetics: string[];
  equippedEffect: string | null;

  mentorId: string;
  mentor?: IMentor | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMentee {
  studentId: string;
  mentorId: string;
  nickname?: string | null;
}
