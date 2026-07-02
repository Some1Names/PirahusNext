import { ApiResponse } from "../interface/response";
import httpClient from "@/src/lib/http";
import { IMentee, ICreateMentee } from "@/src/core/domain/mentee";
import { IMenteeRepository } from "@/src/core/ports/mentee.repository";

export class MenteeRepository implements IMenteeRepository {
  async createMentee(data: ICreateMentee): Promise<ApiResponse<IMentee>> {
    return httpClient.post<IMentee>("/api/mentees", data);
  }
  async createManyMentees(
    data: ICreateMentee[],
  ): Promise<ApiResponse<IMentee[]>> {
    return httpClient.post<IMentee[]>("/api/mentees/batch", data);
  }
  async deleteMentee(id: string): Promise<ApiResponse<IMentee>> {
    return httpClient.delete<IMentee>(`/api/mentees/${id}`);
  }
  async getMenteeById(id: string): Promise<ApiResponse<IMentee>> {
    return httpClient.get<IMentee>(`/api/mentees/${id}`);
  }
  async getAllMentees(): Promise<ApiResponse<IMentee[]>> {
    const response = await httpClient.get<IMentee[]>("/api/mentees");
    return response;
  }
  async getMenteePoint(menteeId: string): Promise<ApiResponse<number>> {
    const response = await httpClient.get<number>(
      `/api/point/mentee/${menteeId}`,
    );
    return response;
  }
  async addMenteePoint(
    menteeId: string,
    point: number,
  ): Promise<ApiResponse<number>> {
    const response = await httpClient.post<number>(
      `/api/point/mentee/${menteeId}`,
      { point },
    );
    return response;
  }
}
