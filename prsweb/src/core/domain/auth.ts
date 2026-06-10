import { IHint } from "./mentor";

export interface Login {
  studentId: string;
}

export interface LoginResponse {
  studentId: string;
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
