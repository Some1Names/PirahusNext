import { IGiftClientRepository } from "@/src/core/ports/client/gift.repository.port";
import { IGiftTransfer } from "@/src/core/domain/gift";
import { parseSchema } from "@/src/lib/validation";
import { giftTransferSchema } from "@/src/core/schema/gift";

export class GiftService {
  constructor(private giftRepository: IGiftClientRepository) {}

  async transferGift(data: IGiftTransfer) {
    const parsedData = parseSchema(giftTransferSchema, data);
    const res = await this.giftRepository.transferGift(parsedData);
    return res.data;
  }
}
