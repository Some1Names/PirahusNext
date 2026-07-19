import { z } from "zod";

export const setPointSchema = z.object({
  point: z.number().int().min(0),
});

export type SetPointInput = z.infer<typeof setPointSchema>;
