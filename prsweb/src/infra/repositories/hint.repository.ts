import httpClient from "@/src/lib/http";
import { ApiResponse } from "@/src/infra/interface/response";
import { IHint, IAddHints, IUpdateHints } from "@/src/core/domain/hint";
import { IHintRepository } from "@/src/core/ports/hint.repository";

export class HintRepository implements IHintRepository {
  async addHints(data: IAddHints): Promise<ApiResponse<IHint[]>> {
    return httpClient.post<IHint[]>("/api/hint", data);
  }
  async updateHints(
    id: string,
    data: IUpdateHints,
  ): Promise<ApiResponse<IHint[]>> {
    return httpClient.put<IHint[]>(`/api/hint/${id}`, data);
  }
  async deleteHint(id: string): Promise<ApiResponse<IHint>> {
    return httpClient.delete<IHint>(`/api/hint/${id}`);
  }
  async getHintsByMentorId(mentorId: string): Promise<ApiResponse<IHint[]>> {
    return httpClient.get<IHint[]>(`/api/hint/mentor/${mentorId}`);
  }
}
