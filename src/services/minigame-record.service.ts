import { IMinigameRecordRepository } from "@/src/core/ports/server/minigame-record.repository.port";
import { MinigameRecordRepository } from "@/src/repositories/minigame-record.repository";
import { MentorRepository } from "@/src/repositories/mentor.repository";
import { MenteeRepository } from "@/src/repositories/mentee.repository";
import { IMentorRepository } from "@/src/core/ports/server/mentor.repository.port";
import { IMenteeRepository } from "@/src/core/ports/server/mentee.repository.port";

export class MinigameRecordService {
  constructor(
    private readonly recordRepo: IMinigameRecordRepository = new MinigameRecordRepository(),
    private readonly mentorRepo: IMentorRepository = new MentorRepository(),
    private readonly menteeRepo: IMenteeRepository = new MenteeRepository()
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
      const mentee = await this.menteeRepo.findByStudentId(studentId);
      if (!mentee) throw new Error("User not found");
      menteeId = mentee.id;
    } else {
      const mentor = await this.mentorRepo.findByStudentId(studentId);
      if (!mentor) throw new Error("User not found");
      mentorId = mentor.id;
    }

    const existing = await this.recordRepo.findExistingRecord(menteeId, mentorId, gameName);
    const isTrace = gameName.startsWith("trace");
    const isSort = gameName.startsWith("sort");

    if (existing) {
      let shouldUpdate = false;
      if (isTrace || isSort) {
        if (score !== undefined) {
          if (
            existing.score === null ||
            score > existing.score ||
            (score === existing.score && timeTaken < existing.timeTaken)
          ) {
            shouldUpdate = true;
          }
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

  async getTopScores(limit: number = 10) {
    return this.recordRepo.getTopScores(limit);
  }
}
