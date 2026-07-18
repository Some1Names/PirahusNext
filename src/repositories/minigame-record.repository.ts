import { prisma } from "@/src/lib/prisma";
import { IMinigameRecordRepository } from "@/src/core/ports/server/minigame-record.repository.port";
import { IMinigameRecordResponse } from "@/src/core/domain/minigame";
import { ILeaderboardResponse } from "@/src/core/domain/leaderboard";

export class MinigameRecordRepository implements IMinigameRecordRepository {

  async findExistingRecord(menteeId: string | null, mentorId: string | null, gameName: string): Promise<{ id: string, timeTaken: number, score: number | null } | null> {
    const existing = await prisma.minigameRecord.findFirst({
      where: menteeId ? { menteeId, gameName } : { mentorId, gameName },
    });
    if (!existing) return null;
    return { id: existing.id, timeTaken: existing.timeTaken, score: existing.score };
  }

  async createRecord(menteeId: string | null, mentorId: string | null, gameName: string, timeTaken: number, score?: number, correctAnswers?: number, totalAnswers?: number): Promise<void> {
    await prisma.minigameRecord.create({
      data: {
        gameName,
        timeTaken,
        score,
        correctAnswers,
        totalAnswers,
        menteeId,
        mentorId,
      },
    });
  }

  async updateRecord(id: string, timeTaken: number, score?: number, correctAnswers?: number, totalAnswers?: number): Promise<void> {
    await prisma.minigameRecord.update({
      where: { id },
      data: { timeTaken, score, correctAnswers, totalAnswers },
    });
  }

  async getLeaderboard(gameName: string, limit: number): Promise<IMinigameRecordResponse[]> {
    const isTrace = gameName.startsWith("trace");
    const isSort = gameName.startsWith("sort");
    const records = await prisma.minigameRecord.findMany({
      where: { gameName },
      orderBy: isTrace || isSort ? [{ score: "desc" }, { timeTaken: "asc" }] : { timeTaken: "asc" },
      take: limit,
      include: {
        mentee: true,
        mentor: true,
      },
    });

    return records.map((r, index) => {
      const user = r.mentee || r.mentor;
      const role = r.mentee ? "Mentee" : "Mentor";
      return {
        id: r.id,
        rank: index + 1,
        timeTaken: r.timeTaken,
        score: r.score,
        correctAnswers: r.correctAnswers,
        totalAnswers: r.totalAnswers,
        userId: user!.id,
        username: `[${role}] ${user!.nickname || user!.studentId}`,
      };
    });
  }

  async getTopScores(limit: number = 10): Promise<ILeaderboardResponse> {
    const [topMentors, topMentees] = await Promise.all([
      prisma.mentor.findMany({
        orderBy: { point: "desc" },
        take: limit,
        select: { id: true, studentId: true, nickname: true, point: true },
      }),
      prisma.mentee.findMany({
        orderBy: { point: "desc" },
        take: limit,
        select: { id: true, studentId: true, nickname: true, point: true },
      }),
    ]);

    return {
      mentors: topMentors.map((m) => ({ ...m, role: "mentor" })),
      mentees: topMentees.map((m) => ({ ...m, role: "mentee" })),
    };
  }
}
