import { ApiResponse } from "@/src/infra/interface/response";
import { IMentor, ICreateMentor } from "../domain/mentor";

export interface IMentorRepository {
  createMentor(data: ICreateMentor): Promise<ApiResponse<IMentor>>;
  createManyMentors(data: ICreateMentor[]): Promise<ApiResponse<IMentor[]>>;
  deleteMentor(id: string): Promise<ApiResponse<IMentor>>;
  getMentorById(id: string): Promise<ApiResponse<IMentor>>;
  getAllMentors(): Promise<ApiResponse<IMentor[]>>;
  setAdminRole(id: string, isAdmin: boolean): Promise<ApiResponse<IMentor>>;
  getMentorPoint(mentorId: string): Promise<ApiResponse<number>>;
  addMentorPoint(
    mentorId: string,
    point: number,
  ): Promise<ApiResponse<number>>;
}
