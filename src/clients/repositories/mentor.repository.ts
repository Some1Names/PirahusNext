import { ApiResponse } from "@/src/core/interface/response";
import httpClient from "@/src/lib/http";
import { IMentor, ICreateMentor } from "@/src/core/domain/mentor";

import { IMentorClientRepository } from "@/src/core/ports/client/mentor.repository.port";

export class MentorClientRepository implements IMentorClientRepository {
  async createMentor(data: ICreateMentor): Promise<ApiResponse<IMentor>> {
    return httpClient.post<IMentor>("/api/mentors", data);
  }
  async createManyMentors(data: ICreateMentor[]): Promise<ApiResponse<IMentor[]>> {
    return httpClient.post<IMentor[]>("/api/mentors/batch", data);
  }
  async deleteMentor(id: string): Promise<ApiResponse<IMentor>> {
    return httpClient.delete<IMentor>(`/api/mentors/${id}`);
  }
  async getMentorById(id: string): Promise<ApiResponse<IMentor>> {
    return httpClient.get<IMentor>(`/api/mentors/${id}`);
  }
  async getAllMentors(): Promise<ApiResponse<IMentor[]>> {
    return httpClient.get<IMentor[]>("/api/mentors");
  }
  async setAdminRole(id: string, isAdmin: boolean): Promise<ApiResponse<IMentor>> {
    return httpClient.patch<IMentor>(`/api/mentors/${id}`, { isAdmin });
  }
  async getMentorPoint(mentorId: string): Promise<ApiResponse<number>> {
    return httpClient.get<number>(`/api/point/mentor/${mentorId}`);
  }

  async setMentorPoint(mentorId: string, point: number): Promise<ApiResponse<number>> {
    return httpClient.put<number>(`/api/point/mentor/${mentorId}`, { point });
  }
}
