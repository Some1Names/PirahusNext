import { z } from "zod";

export const unlockCosmeticSchema = z.object({
  id: z.string().min(1),
});

export const equipCosmeticSchema = z.object({
  id: z.string().nullable(),
});

export type UnlockCosmeticInput = z.infer<typeof unlockCosmeticSchema>;
export type EquipCosmeticInput = z.infer<typeof equipCosmeticSchema>;
