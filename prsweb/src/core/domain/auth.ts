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
  point: number;
}

export interface MentorUser extends BaseUser {
  role: "admin" | "mentor";
  mentee: {
    id: string;
    studentId: string;
    name: string | null;
  } | null;
}

export interface MenteeUser extends BaseUser {
  role: "mentee";
}
