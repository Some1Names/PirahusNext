import { IMinigameClientRepository } from "@/src/core/ports/client/minigame.repository.port";

export class MinigameClientService {
  constructor(private readonly repository: IMinigameClientRepository) {}

  async submitRecord(
    gameName: string,
    timeTaken?: number,
    score?: number,
    correctAnswers?: number,
    totalAnswers?: number
  ): Promise<void> {
    const res = await this.repository.submitRecord(gameName, timeTaken, score, correctAnswers, totalAnswers);
    if (res.error) throw new Error(res.error);
  }

  async getLeaderboard(gameName: string, limit: number = 10) {
    const res = await this.repository.getLeaderboard(gameName, limit);
    return res.data;
  }

  async getTopScores(limit: number = 10) {
    const res = await this.repository.getTopScores(limit);
    return res.data;
  }
}
