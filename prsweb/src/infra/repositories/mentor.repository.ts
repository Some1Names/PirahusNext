import { ApiResponse } from "../interface/response";
import httpClient from "@/src/lib/http";
import { IMentor, ICreateMentor } from "@/src/core/domain/mentor";
import { IMentorRepository } from "@/src/core/ports/mentor.repository";

export class MentorRepository implements IMentorRepository {
  async createMentor(data: ICreateMentor): Promise<ApiResponse<IMentor>> {
    return httpClient.post<IMentor>("/api/mentors", data);
  }
  async createManyMentors(
    data: ICreateMentor[],
  ): Promise<ApiResponse<IMentor[]>> {
    return httpClient.post<IMentor[]>("/api/mentors/batch", data);
  }
  async deleteMentor(id: string): Promise<ApiResponse<IMentor>> {
    return httpClient.delete<IMentor>("/api/mentors/" + id);
  }
  async getMentorById(id: string): Promise<ApiResponse<IMentor>> {
    return httpClient.get<IMentor>("/api/mentors/" + id);
  }
  async getAllMentors(): Promise<ApiResponse<IMentor[]>> {
    return httpClient.get<IMentor[]>("/api/mentors");
  }
}
