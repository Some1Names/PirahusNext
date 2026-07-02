import { z } from "zod";

export const addMenteePointSchema = z.object({
  point: z.number().int().min(0).max(100),
});

export type AddMenteePointInput = z.infer<typeof addMenteePointSchema>;

export const addMentorPointSchema = z.object({
  point: z.number().int().min(0).max(100),
});

export type AddMentorPointInput = z.infer<typeof addMentorPointSchema>;
