import { ApiResponse } from "@/src/core/interface/response";
import { ICreateMentor, IMentor } from "@/src/core/domain/mentor";

export interface IMentorClientRepository {
  createMentor(data: ICreateMentor): Promise<ApiResponse<IMentor>>;
  createManyMentors(data: ICreateMentor[]): Promise<ApiResponse<IMentor[]>>;
  deleteMentor(id: string): Promise<ApiResponse<IMentor>>;
  getMentorById(id: string): Promise<ApiResponse<IMentor>>;
  getAllMentors(): Promise<ApiResponse<IMentor[]>>;
  setAdminRole(id: string, isAdmin: boolean): Promise<ApiResponse<IMentor>>;
  getMentorPoint(mentorId: string): Promise<ApiResponse<number>>;
  setMentorPoint(mentorId: string, point: number): Promise<ApiResponse<number>>;
}
