import { ApiResponse } from "../interface/response";
import httpClient from "@/src/lib/http";
import {
  IMentee,
  ICreateMentee,
  IUpdateMentee,
} from "@/src/core/domain/mentee";
import { IMenteeRepository } from "@/src/core/ports/mentee.repository";

export class MenteeRepository implements IMenteeRepository {
  async createMentee(data: ICreateMentee): Promise<ApiResponse<IMentee>> {
    return httpClient.post<IMentee>("/mentees", data);
  }
  async updateMentee(data: IUpdateMentee): Promise<ApiResponse<IMentee>> {
    return httpClient.put<IMentee>("/mentees", data);
  }
  async deleteMentee(id: string): Promise<ApiResponse<IMentee>> {
    return httpClient.delete<IMentee>("/mentees/" + id);
  }
  async getMenteeById(id: string): Promise<ApiResponse<IMentee>> {
    return httpClient.get<IMentee>("/mentees/" + id);
  }
  async getAllMentees(): Promise<ApiResponse<IMentee[]>> {
    return httpClient.get<IMentee[]>("/mentees");
  }
}
