import type { ShopItem } from "@/src/lib/shop/Types";

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "spin",
    category: "spin",
    name: "Spin",
    description: "หมุนวงล้อ 100 pts เพื่อรับ hint / ชื่อน้องรหัส",
    price: 100,
    icon: "🎡",
    disabled: true, // ฟีเจอร์นี้มีอยู่แล้วที่หน้าอื่น ปุ่มนี้แค่ลิงก์ไปหา
  },

  // hint ซื้อตรง แยกจาก spin — ยิ่งเลเวลสูงยิ่งเจาะจง/ใกล้คำตอบมากขึ้น ราคาก็สูงตาม
  {
    id: "hint-lv1",
    category: "hint",
    name: "Hint Lv.1",
    description: "คำใบ้กว้างๆ เช่น หมวดหมู่ทั่วไป",
    price: 50,
    icon: "💡",
    hintLevel: 1,
  },
  {
    id: "hint-lv2",
    category: "hint",
    name: "Hint Lv.2",
    description: "คำใบ้เจาะจงขึ้น เช่น ปีการศึกษา/คณะ",
    price: 90,
    icon: "💡",
    hintLevel: 2,
  },
  {
    id: "hint-lv3",
    category: "hint",
    name: "Hint Lv.3",
    description: "คำใบ้เจาะจงขึ้น เช่น ตัวอักษรแรกของชื่อ",
    price: 150,
    icon: "💡",
    hintLevel: 3,
  },
  {
    id: "hint-lv4",
    category: "hint",
    name: "Hint Lv.4",
    description: "คำใบ้ใกล้เคียงคำตอบมาก เช่น เพศ/ลักษณะเด่น",
    price: 230,
    icon: "💡",
    hintLevel: 4,
  },
  {
    id: "hint-lv5",
    category: "hint",
    name: "Hint Lv.5",
    description: "คำใบ้ชัดสุด เกือบเท่าเฉลย",
    price: 350,
    icon: "💡",
    hintLevel: 5,
  },

  {
    id: "effect-sparkle",
    category: "cosmetic",
    name: "Pixel Sparkle",
    description: "ประกายพิกเซลตามการคลิก",
    price: 200,
    icon: "✨",
    effectKey: "click-spark",
  },
  {
    id: "effect-ribbon",
    category: "cosmetic",
    name: "Ribbon Trail",
    description: "ริบบิ้นสีไหลตามเมาส์แบบ WebGL",
    price: 250,
    icon: "🎀",
    effectKey: "ribbons",
  },
  {
    id: "effect-splash",
    category: "cosmetic",
    name: "Splash Cursor",
    description: "ของไหลสีสันกระเซ็นตามเมาส์ (เอฟเฟกต์หนักสุด)",
    price: 400,
    icon: "🌊",
    effectKey: "splash-cursor",
  },
];