import { ShopItemRepository } from "@/src/repositories/shop-item.repository";
import { NotFoundError } from "@/src/core/error/error";
import {
  ShopItemEntity,
  CreateShopItemInput,
  UpdateShopItemInput,
} from "@/src/core/domain/shop-item";
import { ShopCategory } from "@/src/lib/shop/Types";
import { IShopItemRepository } from "@/src/core/ports/server/shop-item.repository.port";

export class ShopItemService {
  constructor(
    private readonly shopItemRepo: IShopItemRepository = new ShopItemRepository(),
  ) {}

  async findAll(): Promise<ShopItemEntity[]> {
    return this.shopItemRepo.findAll();
  }

  async findByCategory(category: ShopCategory): Promise<ShopItemEntity[]> {
    return this.shopItemRepo.findByCategory(category);
  }

  async findById(id: string): Promise<ShopItemEntity> {
    const item = await this.shopItemRepo.findById(id);
    if (!item) throw new NotFoundError("ShopItem not found");
    return item;
  }

  async create(data: CreateShopItemInput): Promise<ShopItemEntity> {
    return this.shopItemRepo.create(data);
  }

  async update(id: string, data: UpdateShopItemInput): Promise<ShopItemEntity> {
    const existing = await this.shopItemRepo.findById(id);
    if (!existing) throw new NotFoundError("ShopItem not found");
    return this.shopItemRepo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.shopItemRepo.findById(id);
    if (!existing) throw new NotFoundError("ShopItem not found");
    await this.shopItemRepo.delete(id);
  }
}
