import { ApiResponse } from "@/src/core/interface/response";
import httpClient from "@/src/lib/http";

import { IMinigameRecordResponse } from "@/src/core/domain/minigame";
import { ILeaderboardResponse } from "@/src/core/domain/leaderboard";

import { IMinigameClientRepository } from "@/src/core/ports/client/minigame.repository.port";

export class MinigameClientRepository implements IMinigameClientRepository {
  async submitRecord(
    gameName: string,
    timeTaken?: number,
    score?: number,
    correctAnswers?: number,
    totalAnswers?: number
  ): Promise<ApiResponse<void>> {
    const res = await httpClient.post<void>("/api/minigames/record", {
      gameName,
      timeTaken,
      score,
      correctAnswers,
      totalAnswers
    });
    return res;
  }

  async getLeaderboard(
    gameName: string,
    limit: number = 10,
  ): Promise<ApiResponse<IMinigameRecordResponse[]>> {
    const res = await httpClient.get<IMinigameRecordResponse[]>(
      `/api/minigames/record?gameName=${gameName}&limit=${limit}`,
    );
    return res;
  }

  async getTopScores(
    limit: number = 10,
  ): Promise<ApiResponse<ILeaderboardResponse>> {
    const res = await httpClient.get<ILeaderboardResponse>(
      `/api/minigames/points?limit=${limit}`,
    );
    return res;
  }
}
