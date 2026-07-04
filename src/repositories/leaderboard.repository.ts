import { prisma } from "@/src/lib/prisma";
import { ILeaderboardResponse } from "@/src/core/domain/leaderboard";

export class LeaderboardRepository {
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
