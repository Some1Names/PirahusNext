import { IGiftRepository } from "../ports/gift.repository";
import { IGiftTransfer } from "../domain/gift";
import { parseSchema } from "@/src/lib/validation";
import { giftTransferSchema } from "../schema/gift";

export class GiftService {
  constructor(private giftRepository: IGiftRepository) {}

  async transferGift(data: IGiftTransfer) {
    const parsedData = parseSchema(giftTransferSchema, data);
    try {
      const res = await this.giftRepository.transferGift(parsedData);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
