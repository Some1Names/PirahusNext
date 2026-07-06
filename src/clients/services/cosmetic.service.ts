import {
  IUnlockCosmeticResult,
  IEquipCosmeticResult,
} from "@/src/core/domain/cosmetic";
import { ICosmeticClientRepository } from "@/src/core/ports/client/cosmetic.repository.port";

export class CosmeticService {
  constructor(private readonly cosmeticRepository: ICosmeticClientRepository) {}

  async unlockCosmetic(id: string): Promise<IUnlockCosmeticResult> {
    const res = await this.cosmeticRepository.unlockCosmetic(id);
    return res.data;
  }

  async equipCosmetic(id: string | null): Promise<IEquipCosmeticResult> {
    const res = await this.cosmeticRepository.equipCosmetic(id);
    return res.data;
  }
}
