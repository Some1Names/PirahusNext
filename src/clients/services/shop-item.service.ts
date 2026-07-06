import { IShopItemClientRepository } from "@/src/core/ports/client/shop-item.repository.port";
import {
  ShopItemEntity,
  CreateShopItemInput,
  UpdateShopItemInput,
} from "@/src/core/domain/shop-item";

export class ShopItemService {
  constructor(private readonly shopItemRepository: IShopItemClientRepository) {}

  async getAllShopItems(): Promise<ShopItemEntity[]> {
    const response = await this.shopItemRepository.findAll();
    return response.data;
  }

  async getShopItemsByCategory(category: string): Promise<ShopItemEntity[]> {
    const response = await this.shopItemRepository.findByCategory(category);
    return response.data;
  }

  async getShopItemById(id: string): Promise<ShopItemEntity | null> {
    const response = await this.shopItemRepository.findById(id);
    return response.data;
  }

  async createShopItem(data: CreateShopItemInput): Promise<ShopItemEntity> {
    const response = await this.shopItemRepository.create(data);
    return response.data;
  }

  async updateShopItem(
    id: string,
    data: UpdateShopItemInput,
  ): Promise<ShopItemEntity> {
    const response = await this.shopItemRepository.update(id, data);
    return response.data;
  }

  async deleteShopItem(id: string): Promise<void> {
    await this.shopItemRepository.delete(id);
  }
}
