import { ApiResponse } from "@/src/infra/interface/response";
import { ShopItemEntity, CreateShopItemInput, UpdateShopItemInput } from "../domain/shop-item";

export interface IShopItemRepository {
  findAll(): Promise<ApiResponse<ShopItemEntity[]>>;
  findByCategory(category: string): Promise<ApiResponse<ShopItemEntity[]>>;
  findById(id: string): Promise<ApiResponse<ShopItemEntity | null>>;
  create(data: CreateShopItemInput): Promise<ApiResponse<ShopItemEntity>>;
  update(id: string, data: UpdateShopItemInput): Promise<ApiResponse<ShopItemEntity>>;
  delete(id: string): Promise<ApiResponse<void>>;
}
