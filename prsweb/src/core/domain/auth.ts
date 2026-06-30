import { IHint } from "./hint";

export interface Login {
  studentId: string;
  password?: string | null;
}

export interface LoginResponse {
  studentId: string;
  firstLogin: boolean;
  hasPassword?: boolean;
}

export interface SetupPasswordResponse {
  message: string;
}

export type CurrentUser = MentorUser | MenteeUser;

interface BaseUser {
  id: string;
  studentId: string;
  name: string | null;
  role: "admin" | "mentor" | "mentee";
}

export interface MentorUser extends BaseUser {
  type: "mentor";
  point: number;
  mentee: {
    id: string;
    studentId: string;
    name: string | null;
  }[];
}

export interface MenteeUser extends BaseUser {
  type: "mentee";
  point: number;
  unlockedHintLevels: number[];
  mentorId: string | null;
  mentor: {
    id: string;
    studentId: string;
    name: string | null;
  } | null;
}
