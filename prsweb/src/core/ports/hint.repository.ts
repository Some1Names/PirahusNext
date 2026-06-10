import { ApiResponse } from "@/src/infra/interface/response";
import { IHint, IAddHints, IUpdateHints } from "../domain/hint";

export interface IHintRepository {
  addHints(data: IAddHints): Promise<ApiResponse<IHint[]>>;
  updateHints(
    mentorId: string,
    data: IUpdateHints,
  ): Promise<ApiResponse<IHint[]>>;
  deleteHint(id: string): Promise<ApiResponse<IHint>>;
  getHintsByMentorId(mentorId: string): Promise<ApiResponse<IHint[]>>;
}
