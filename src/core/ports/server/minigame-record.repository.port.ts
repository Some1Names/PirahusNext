import { IMinigameRecordResponse } from "@/src/core/domain/minigame";

export interface IMinigameRecordRepository {
  findMenteeIdByStudentId(studentId: string): Promise<string | null>;
  findMentorIdByStudentId(studentId: string): Promise<string | null>;
  findExistingRecord(menteeId: string | null, mentorId: string | null, gameName: string): Promise<{ id: string, timeTaken: number } | null>;
  createRecord(menteeId: string | null, mentorId: string | null, gameName: string, timeTaken: number): Promise<void>;
  updateRecord(id: string, timeTaken: number): Promise<void>;
  getLeaderboard(gameName: string, limit: number): Promise<IMinigameRecordResponse[]>;
}
