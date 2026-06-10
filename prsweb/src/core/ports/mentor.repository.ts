import { ApiResponse } from "@/src/infra/interface/response";
import {
  IMentor,
  ICreateMentor,
  IUpdateMentor,
  IAddHints,
  IUpdateHints,
} from "../domain/mentor";

export interface IMentorRepository {
  createMentor(data: ICreateMentor): Promise<ApiResponse<IMentor>>;
  createManyMentors(data: ICreateMentor[]): Promise<ApiResponse<IMentor[]>>;
  updateMentor(data: IUpdateMentor): Promise<ApiResponse<IMentor>>;
  deleteMentor(id: string): Promise<ApiResponse<IMentor>>;
  getMentorById(id: string): Promise<ApiResponse<IMentor>>;
  getAllMentors(): Promise<ApiResponse<IMentor[]>>;
  addHints(mentorId: string, data: IAddHints): Promise<ApiResponse<IMentor>>;
  updateHints(
    mentorId: string,
    data: IUpdateHints,
  ): Promise<ApiResponse<IMentor>>;
}
