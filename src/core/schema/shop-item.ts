import { z } from "zod";

const categoryEnum = z.enum(["spin", "cosmetic", "hint"]);
const effectKeyEnum = z.enum([
  "click-spark",
  "ribbons",
  "splash-cursor",
  "pixel-trail",
]);

export const createShopItemSchema = z.object({
  category: categoryEnum,
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().min(0, "Price must be non-negative"),
  icon: z.string(),
  disabled: z.boolean().optional().default(false),
  effectKey: effectKeyEnum.nullable().optional(),
  hintLevel: z.number().nullable().optional(),
});

export const updateShopItemSchema = z.object({
  category: categoryEnum.optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  icon: z.string().optional(),
  disabled: z.boolean().optional(),
  effectKey: effectKeyEnum.nullable().optional(),
  hintLevel: z.number().nullable().optional(),
});
