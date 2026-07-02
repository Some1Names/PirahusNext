import { ApiResponse } from "@/src/infra/interface/response";
import { IUnlockCosmeticResult, IEquipCosmeticResult } from "../domain/cosmetic";

export interface ICosmeticRepository {
  unlockCosmetic(id: string): Promise<ApiResponse<IUnlockCosmeticResult>>;
  equipCosmetic(id: string | null): Promise<ApiResponse<IEquipCosmeticResult>>;
}
