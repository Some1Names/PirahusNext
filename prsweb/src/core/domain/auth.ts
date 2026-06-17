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

export interface CurrentUser {
  id: string;
  studentId: string;
  role: "mentor" | "mentee";

  mentor?: {
    id: string;
    hints: IHint[];
  };

  mentee?: {
    id: string;
  };
}
