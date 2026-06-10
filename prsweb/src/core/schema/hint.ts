import { z } from "zod";

export const hintSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1),
});

export const addHintsSchema = z.object({
  mentorId: z.string().min(1),
  hints: z.array(z.string()).min(1),
});

export type AddHintsInput = z.infer<typeof addHintsSchema>;

export const updateHintsSchema = z.object({
  hints: z.array(hintSchema).min(1),
});

export type UpdateHintsInput = z.infer<typeof updateHintsSchema>;
