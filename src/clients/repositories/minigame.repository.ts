import { ApiResponse } from "@/src/core/interface/response";
import httpClient from "@/src/lib/http";

import { IMinigameRecordResponse } from "@/src/core/domain/minigame";

import { IMinigameClientRepository } from "@/src/core/ports/client/minigame.repository.port";

export class MinigameClientRepository implements IMinigameClientRepository {
  async submitRecord(
    gameName: string,
    timeTaken: number,
  ): Promise<ApiResponse<void>> {
    const res = await httpClient.post<void>("/api/minigames/record", {
      gameName,
      timeTaken,
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
}
