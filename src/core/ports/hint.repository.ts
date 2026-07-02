import { ApiResponse } from "@/src/infra/interface/response";
import { IHint, IAddHints, IUpdateHints, IMenteeHint, IUnlockHintResult } from "../domain/hint";

export interface IHintRepository {
  addHints(data: IAddHints): Promise<ApiResponse<{ count: number }>>;
  updateHints(id: string, data: IUpdateHints): Promise<ApiResponse<IHint>>;
  deleteHint(id: string): Promise<ApiResponse<IHint>>;
  getHintsByMentorId(mentorId: string): Promise<ApiResponse<IHint[]>>;
  getHintByLevel(level: number): Promise<ApiResponse<IHint[]>>;
  getMenteeHints(): Promise<ApiResponse<IMenteeHint[]>>;
  unlockHint(level: number): Promise<ApiResponse<IUnlockHintResult>>;
}
