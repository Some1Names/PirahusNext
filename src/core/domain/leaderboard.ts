import { Role } from "./user";

export interface ILeaderboardEntry {
  id: string;
  studentId: string;
  nickname: string | null;
  point: number;
  role: Role;
}

export interface ILeaderboardResponse {
  mentors: ILeaderboardEntry[];
  mentees: ILeaderboardEntry[];
}
