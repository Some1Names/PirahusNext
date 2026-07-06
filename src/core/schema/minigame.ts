import { z } from "zod";

export const submitMinigameRecordSchema = z.object({
  gameName: z.string(),
  timeTaken: z.number().int().min(0),
});

export type SubmitMinigameRecordInput = z.infer<typeof submitMinigameRecordSchema>;
