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
    return httpClient.post<IMentor>("/mentors", data);
  }
  async updateMentor(data: IUpdateMentor): Promise<ApiResponse<IMentor>> {
    return httpClient.put<IMentor>("/mentors", data);
  }
  async deleteMentor(id: string): Promise<ApiResponse<IMentor>> {
    return httpClient.delete<IMentor>("/mentors/" + id);
  }
  async getMentorById(id: string): Promise<ApiResponse<IMentor>> {
    return httpClient.get<IMentor>("/mentors/" + id);
  }
  async getAllMentors(): Promise<ApiResponse<IMentor[]>> {
    return httpClient.get<IMentor[]>("/mentors");
  }
  async addHints(data: IAddHints): Promise<ApiResponse<IMentor>> {
    return httpClient.patch<IMentor>(
      "/mentors/hint/add/" + data.id,
      data.hints,
    );
  }
  async updateHints(data: IUpdateHints): Promise<ApiResponse<IMentor>> {
    return httpClient.patch<IMentor>(
      "/mentors/hint/update/" + data.id,
      data.hints,
    );
  }
}
