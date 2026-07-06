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
    timeTaken: number,
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

    const existing = await this.recordRepo.findExistingRecord(
      menteeId,
      mentorId,
      gameName,
    );

    if (existing) {
      if (timeTaken < existing.timeTaken) {
        await this.recordRepo.updateRecord(existing.id, timeTaken);
      }
    } else {
      await this.recordRepo.createRecord(
        menteeId,
        mentorId,
        gameName,
        timeTaken,
      );
    }

    return { success: true };
  }

  async getLeaderboard(gameName: string, limit: number = 10) {
    return this.recordRepo.getLeaderboard(gameName, limit);
  }
}
