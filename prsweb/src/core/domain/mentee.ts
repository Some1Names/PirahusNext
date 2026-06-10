import { IMentor } from "./mentor";

export interface IMentee {
  id: string;
  studentId: string;

  mentorId: string;
  mentor: IMentor;

  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMentee {
  studentId: string;
  mentorId: string;
}
