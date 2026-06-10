import { ApiResponse } from "../interface/response";
import httpClient from "@/src/lib/http";
import {
  IMentor,
  ICreateMentor,
  IUpdateMentor,
  IAddHints,
  IUpdateHints,
} from "@/src/core/domain/mentor";
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
  async updateMentor(data: IUpdateMentor): Promise<ApiResponse<IMentor>> {
    return httpClient.put<IMentor>("/api/mentors", data);
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
  async addHints(data: IAddHints): Promise<ApiResponse<IMentor>> {
    return httpClient.patch<IMentor>(
      "/api/mentors/hint/add/" + data.mentorId,
      data.hints,
    );
  }
  async updateHints(data: IUpdateHints): Promise<ApiResponse<IMentor>> {
    return httpClient.patch<IMentor>(
      "/api/mentors/hint/update/" + data.mentorId,
      data.hints,
    );
  }
}
