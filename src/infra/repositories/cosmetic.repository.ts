import httpClient from "@/src/lib/http";
import { ApiResponse } from "@/src/infra/interface/response";
import { IUnlockCosmeticResult, IEquipCosmeticResult } from "@/src/core/domain/cosmetic";
import { ICosmeticRepository } from "@/src/core/ports/cosmetic.repository";

export class CosmeticRepository implements ICosmeticRepository {
  async unlockCosmetic(id: string): Promise<ApiResponse<IUnlockCosmeticResult>> {
    return httpClient.post<IUnlockCosmeticResult>("/api/cosmetic/unlock", { id });
  }

  async equipCosmetic(id: string | null): Promise<ApiResponse<IEquipCosmeticResult>> {
    return httpClient.post<IEquipCosmeticResult>("/api/cosmetic/equip", { id });
  }
}
