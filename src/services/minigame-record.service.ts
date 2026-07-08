import { IMinigameRecordRepository } from "@/src/core/ports/server/minigame-record.repository.port";
import { MinigameRecordRepository } from "@/src/repositories/minigame-record.repository";

export class MinigameRecordService {
  constructor(
    private readonly recordRepo: IMinigameRecordRepository = new MinigameRecordRepository(),
  ) {}

  async submitRecord(
    studentId: string,
    role: "admin" | "mentor" | "mentee",
    gameName: string,
    timeTaken: number = 0,
    score?: number,
    correctAnswers?: number,
    totalAnswers?: number
  ) {
    let menteeId = null;
    let mentorId = null;

    if (role === "mentee") {
      menteeId = await this.recordRepo.findMenteeIdByStudentId(studentId);
      if (!menteeId) throw new Error("User not found");
    } else {
      mentorId = await this.recordRepo.findMentorIdByStudentId(studentId);
      if (!mentorId) throw new Error("User not found");
    }

    const existing = await this.recordRepo.findExistingRecord(menteeId, mentorId, gameName);
    const isTrace = gameName.startsWith("trace");

    if (existing) {
      let shouldUpdate = false;
      if (isTrace) {
        if (score !== undefined && (existing.score === null || score > existing.score)) {
          shouldUpdate = true;
        }
      } else {
        if (timeTaken < existing.timeTaken) {
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        await this.recordRepo.updateRecord(existing.id, timeTaken, score, correctAnswers, totalAnswers);
      }
    } else {
      await this.recordRepo.createRecord(menteeId, mentorId, gameName, timeTaken, score, correctAnswers, totalAnswers);
    }

    return { success: true };
  }

  async getLeaderboard(gameName: string, limit: number = 10) {
    return this.recordRepo.getLeaderboard(gameName, limit);
  }
}
