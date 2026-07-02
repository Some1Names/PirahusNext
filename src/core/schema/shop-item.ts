import { z } from "zod";

export const createShopItemSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string(),
  price: z.number().min(0, "Price must be non-negative"),
  icon: z.string(),
  disabled: z.boolean().optional().default(false),
  effectKey: z.string().nullable().optional(),
  hintLevel: z.number().nullable().optional(),
});

export const updateShopItemSchema = z.object({
  category: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional(),
  icon: z.string().optional(),
  disabled: z.boolean().optional(),
  effectKey: z.string().nullable().optional(),
  hintLevel: z.number().nullable().optional(),
});
