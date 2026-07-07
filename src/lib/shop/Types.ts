export type ShopCategory = "spin" | "cosmetic" | "hint";

export type EffectKey = "click-spark" | "ribbons" | "splash-cursor" | "pixel-trail";

export interface ShopItem {
  id: string;
  category: ShopCategory;
  name: string;
  description: string;
  price: number;
  icon: string; // emoji or path to pixel icon asset
  owned?: boolean;
  disabled?: boolean; // e.g. spin entry that just links elsewhere
  effectKey?: EffectKey; // ถ้ามี แปลว่า item นี้ backed ด้วย effect component จริง (ดู EffectRegistry)
  hintLevel?: number; // 1-5 สำหรับ item หมวด hint ยิ่งเลเวลสูงยิ่งเจาะจง/แพงขึ้น
}

export interface GiftTransfer {
  recipientCode: string; // เลขประจำตัว / username ของเพื่อนในรุ่น
  amount: number;
}