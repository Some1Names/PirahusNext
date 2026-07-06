export interface Login {
  studentId: string;
  password?: string | null;
}

export interface LoginResponse {
  studentId: string;
  firstLogin: boolean;
  hasPassword?: boolean;
}

export interface SetupProfileResponse {
  message: string;
}
