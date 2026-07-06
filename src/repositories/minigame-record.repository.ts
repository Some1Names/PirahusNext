import { prisma } from "@/src/lib/prisma";
import { IMinigameRecordRepository } from "@/src/core/ports/server/minigame-record.repository.port";
import { IMinigameRecordResponse } from "@/src/core/domain/minigame";

export class MinigameRecordRepository implements IMinigameRecordRepository {
  async findMenteeIdByStudentId(studentId: string): Promise<string | null> {
    const mentee = await prisma.mentee.findUnique({ where: { studentId } });
    return mentee?.id || null;
  }

  async findMentorIdByStudentId(studentId: string): Promise<string | null> {
    const mentor = await prisma.mentor.findUnique({ where: { studentId } });
    return mentor?.id || null;
  }

  async findExistingRecord(menteeId: string | null, mentorId: string | null, gameName: string): Promise<{ id: string, timeTaken: number } | null> {
    const existing = await prisma.minigameRecord.findFirst({
      where: menteeId ? { menteeId, gameName } : { mentorId, gameName },
    });
    if (!existing) return null;
    return { id: existing.id, timeTaken: existing.timeTaken };
  }

  async createRecord(menteeId: string | null, mentorId: string | null, gameName: string, timeTaken: number): Promise<void> {
    await prisma.minigameRecord.create({
      data: {
        gameName,
        timeTaken,
        menteeId,
        mentorId,
      },
    });
  }

  async updateRecord(id: string, timeTaken: number): Promise<void> {
    await prisma.minigameRecord.update({
      where: { id },
      data: { timeTaken },
    });
  }

  async getLeaderboard(gameName: string, limit: number): Promise<IMinigameRecordResponse[]> {
    const records = await prisma.minigameRecord.findMany({
      where: { gameName },
      orderBy: { timeTaken: "asc" },
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
        userId: user!.id,
        username: `[${role}] ${user!.nickname || user!.studentId}`,
      };
    });
  }
}
