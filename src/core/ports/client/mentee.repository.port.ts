import { ApiResponse } from "@/src/core/interface/response";
import { ICreateMentee, IMentee } from "@/src/core/domain/mentee";

export interface IMenteeClientRepository {
  createMentee(data: ICreateMentee): Promise<ApiResponse<IMentee>>;
  createManyMentees(data: ICreateMentee[]): Promise<ApiResponse<IMentee[]>>;
  deleteMentee(id: string): Promise<ApiResponse<IMentee>>;
  getMenteeById(id: string): Promise<ApiResponse<IMentee>>;
  getAllMentees(): Promise<ApiResponse<IMentee[]>>;
  getMenteePoint(menteeId: string): Promise<ApiResponse<number>>;
  setMenteePoint(menteeId: string, point: number): Promise<ApiResponse<number>>;
}
