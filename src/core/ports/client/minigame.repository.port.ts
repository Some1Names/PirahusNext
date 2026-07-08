import { ApiResponse } from "@/src/core/interface/response";
import { IMinigameRecordResponse } from "@/src/core/domain/minigame";

export interface IMinigameClientRepository {
  submitRecord(
    gameName: string,
    timeTaken?: number,
    score?: number,
    correctAnswers?: number,
    totalAnswers?: number
  ): Promise<ApiResponse<void>>;
  getLeaderboard(gameName: string, limit?: number): Promise<ApiResponse<IMinigameRecordResponse[]>>;
}
