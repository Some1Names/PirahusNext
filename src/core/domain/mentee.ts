import { IMentor } from "./mentor";

export interface IMentee {
  id: string;
  studentId: string;
  name?: string | null;
  point: number;
  unlockedHintLevels: number[];

  mentorId: string;
  mentor: IMentor;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMentee {
  studentId: string;
  mentorId: string;
  name?: string | null;
}
