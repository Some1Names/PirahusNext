import httpClient from "@/src/lib/http";
import { ApiResponse } from "@/src/infra/interface/response";
import { ShopItemEntity, CreateShopItemInput, UpdateShopItemInput } from "@/src/core/domain/shop-item";
import { IShopItemRepository } from "@/src/core/ports/shop-item.repository";

export class ShopItemRepository implements IShopItemRepository {
  async findAll(): Promise<ApiResponse<ShopItemEntity[]>> {
    return httpClient.get<ShopItemEntity[]>("/api/shop-items");
  }

  async findByCategory(category: string): Promise<ApiResponse<ShopItemEntity[]>> {
    return httpClient.get<ShopItemEntity[]>(`/api/shop-items/category/${category}`);
  }

  async findById(id: string): Promise<ApiResponse<ShopItemEntity | null>> {
    return httpClient.get<ShopItemEntity | null>(`/api/shop-items/${id}`);
  }

  async create(data: CreateShopItemInput): Promise<ApiResponse<ShopItemEntity>> {
    return httpClient.post<ShopItemEntity>("/api/shop-items", data);
  }

  async update(id: string, data: UpdateShopItemInput): Promise<ApiResponse<ShopItemEntity>> {
    return httpClient.put<ShopItemEntity>(`/api/shop-items/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return httpClient.delete<void>(`/api/shop-items/${id}`);
  }
}
