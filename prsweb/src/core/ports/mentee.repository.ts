import { ApiResponse } from "@/src/infra/interface/response";
import { IMentee, ICreateMentee } from "../domain/mentee";

export interface IMenteeRepository {
  createMentee(data: ICreateMentee): Promise<ApiResponse<IMentee>>;
  createManyMentees(data: ICreateMentee[]): Promise<ApiResponse<IMentee[]>>;
  deleteMentee(id: string): Promise<ApiResponse<IMentee>>;
  getMenteeById(id: string): Promise<ApiResponse<IMentee>>;
  getAllMentees(): Promise<ApiResponse<IMentee[]>>;
}
