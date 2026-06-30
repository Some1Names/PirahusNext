import { z } from "zod";

export const addMenteePointSchema = z.object({
  point: z.number().int(),
});

export type AddMenteePointInput = z.infer<typeof addMenteePointSchema>;
