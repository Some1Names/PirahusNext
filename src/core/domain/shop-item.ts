import { ShopCategory, EffectKey } from "@/src/lib/shop/Types";

export interface ShopItemEntity {
  id: string;
  category: ShopCategory;
  name: string;
  description: string;
  price: number;
  icon: string;
  disabled: boolean;
  effectKey: EffectKey | null;
  hintLevel: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateShopItemInput {
  category: ShopCategory;
  name: string;
  description: string;
  price: number;
  icon: string;
  disabled?: boolean;
  effectKey?: EffectKey | null;
  hintLevel?: number | null;
}

export interface UpdateShopItemInput {
  category?: ShopCategory;
  name?: string;
  description?: string;
  price?: number;
  icon?: string;
  disabled?: boolean;
  effectKey?: EffectKey | null;
  hintLevel?: number | null;
}
