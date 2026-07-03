import { ApiResponse } from "@/src/infra/interface/response";
import { IGiftTransfer } from "../domain/gift";

export interface IGiftRepository {
  transferGift(data: IGiftTransfer): Promise<ApiResponse<boolean>>;
}
