import { ApiResponse } from "../interface/response";
import httpClient from "@/src/lib/http";
import { IGiftTransfer } from "@/src/core/domain/gift";
import { IGiftRepository } from "@/src/core/ports/gift.repository";

export class GiftRepository implements IGiftRepository {
  async transferGift(data: IGiftTransfer): Promise<ApiResponse<boolean>> {
    return httpClient.post<boolean>("/api/gift/transfer", data);
  }
}
