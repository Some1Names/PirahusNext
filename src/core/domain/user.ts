export interface BaseUser {
  id: string;
  studentId: string;
  nickname: string | null;
  point: number;
  unlockedCosmetics: string[];
  equippedEffect?: string | null;
}

export type Role = "admin" | "mentor" | "mentee";

export interface MentorUser extends BaseUser {
  role: "admin" | "mentor";
  mentee: {
    id: string;
    studentId: string;
    nickname: string | null;
  } | null;
}

export interface MenteeUser extends BaseUser {
  role: "mentee";
  unlockedHintLevels: number[];
  mentor: {
    studentId: string;
    nickname: string | null;
  } | null;
}

export type CurrentUser = MentorUser | MenteeUser;
