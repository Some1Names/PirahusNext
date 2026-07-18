import { ApiResponse } from "@/src/core/interface/response";
import httpClient from "@/src/lib/http";
import { IMentee, ICreateMentee } from "@/src/core/domain/mentee";

import { IMenteeClientRepository } from "@/src/core/ports/client/mentee.repository.port";

export class MenteeClientRepository implements IMenteeClientRepository {
  async createMentee(data: ICreateMentee): Promise<ApiResponse<IMentee>> {
    return httpClient.post<IMentee>("/api/mentees", data);
  }
  async createManyMentees(data: ICreateMentee[]): Promise<ApiResponse<IMentee[]>> {
    return httpClient.post<IMentee[]>("/api/mentees/batch", data);
  }
  async deleteMentee(id: string): Promise<ApiResponse<IMentee>> {
    return httpClient.delete<IMentee>(`/api/mentees/${id}`);
  }
  async getMenteeById(id: string): Promise<ApiResponse<IMentee>> {
    return httpClient.get<IMentee>(`/api/mentees/${id}`);
  }
  async getAllMentees(): Promise<ApiResponse<IMentee[]>> {
    return httpClient.get<IMentee[]>("/api/mentees");
  }
  async getMenteePoint(menteeId: string): Promise<ApiResponse<number>> {
    return httpClient.get<number>(`/api/point/mentee/${menteeId}`);
  }

  async setMenteePoint(menteeId: string, point: number): Promise<ApiResponse<number>> {
    return httpClient.put<number>(`/api/point/mentee/${menteeId}`, { point });
  }
}
