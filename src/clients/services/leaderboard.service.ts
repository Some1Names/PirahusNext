import { ILeaderboardClientRepository } from "@/src/core/ports/client/leaderboard.repository.port";
import { ILeaderboardResponse } from "@/src/core/domain/leaderboard";

export class LeaderboardService {
  constructor(
    private readonly leaderboardRepository: ILeaderboardClientRepository,
  ) {}

  async getTopScores(limit: number = 10): Promise<ILeaderboardResponse> {
    const response = await this.leaderboardRepository.getTopScores(limit);
    return response.data;
  }
}
