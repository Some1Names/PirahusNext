import { IUnlockCosmeticResult, IEquipCosmeticResult } from "../domain/cosmetic";
import { ICosmeticRepository } from "../ports/cosmetic.repository";

export class CosmeticService {
  constructor(private readonly cosmeticRepository: ICosmeticRepository) {}
  
  async unlockCosmetic(id: string): Promise<IUnlockCosmeticResult> {
    try {
      const res = await this.cosmeticRepository.unlockCosmetic(id);
      return res.data;
    } catch (error) {
      throw error;
    }
  }

  async equipCosmetic(id: string | null): Promise<IEquipCosmeticResult> {
    try {
      const res = await this.cosmeticRepository.equipCosmetic(id);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
