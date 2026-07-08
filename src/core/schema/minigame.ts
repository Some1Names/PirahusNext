import { z } from "zod";

export const submitMinigameRecordSchema = z.object({
  gameName: z.string(),
  timeTaken: z.number().int().min(0).optional(),
  score: z.number().min(0).optional(),
  correctAnswers: z.number().int().min(0).optional(),
  totalAnswers: z.number().int().min(0).optional(),
});

export type SubmitMinigameRecordInput = z.infer<typeof submitMinigameRecordSchema>;
