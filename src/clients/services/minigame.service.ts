import { IMinigameClientRepository } from "@/src/core/ports/client/minigame.repository.port";

export class MinigameClientService {
  constructor(private readonly repository: IMinigameClientRepository) {}

  async submitRecord(gameName: string, timeTaken: number) {
    const res = await this.repository.submitRecord(gameName, timeTaken);
    return res.data;
  }

  async getLeaderboard(gameName: string, limit: number = 10) {
    const res = await this.repository.getLeaderboard(gameName, limit);
    return res.data;
  }
}
