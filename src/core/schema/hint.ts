import { z } from "zod";

export const hintSchema = z.object({
  id: z.string().min(1),
  content: z.string().min(1),
});

export const addHintsSchema = z.object({
  mentorId: z.string().min(1),
  hints: z.array(
    z.object({
      content: z.string().min(1),
      level: z.number().int().min(1).max(5),
    })
  ).min(1).max(5),
});

export type AddHintsInput = z.infer<typeof addHintsSchema>;

export const updateHintsSchema = z.object({
  content: z.string().min(1),
});

export type UpdateHintsInput = z.infer<typeof updateHintsSchema>;

export const unlockHintSchema = z.object({
  level: z.number().int().min(1).max(5),
});

export type UnlockHintInput = z.infer<typeof unlockHintSchema>;
