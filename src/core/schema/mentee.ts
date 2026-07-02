import { z } from "zod";
import { idSchema, IdInput } from "./common";

export const createMenteeSchema = z.object({
  studentId: z.string().min(1),
  mentorId: z.string().min(1),
  name: z.string().optional().nullable(),
});

export type CreateMenteeInput = z.infer<typeof createMenteeSchema>;

export const deleteMenteeSchema = idSchema;
export type DeleteMenteeInput = IdInput;

export const getMenteeByIdSchema = idSchema;
export type GetMenteeByIdInput = IdInput;

export const getAllMenteesSchema = z.object({});

export type GetAllMenteesInput = z.infer<typeof getAllMenteesSchema>;
