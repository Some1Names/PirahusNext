import { z } from "zod";
import { idSchema, IdInput } from "./common";

export const createMentorSchema = z.object({
  studentId: z.string().min(1),
  name: z.string().optional().nullable(),
});

export type CreateMentorInput = z.infer<typeof createMentorSchema>;

export const updateMentorSchema = z.object({
  id: z.string().min(1),
  studentId: z.string().min(1),
  name: z.string().optional().nullable(),
});

export type UpdateMentorInput = z.infer<typeof updateMentorSchema>;

export const deleteMentorSchema = idSchema;
export type DeleteMentorInput = IdInput;

export const getMentorByIdSchema = idSchema;
export type GetMentorByIdInput = IdInput;

export const getAllMentorsSchema = z.object({});

export type GetAllMentorsInput = z.infer<typeof getAllMentorsSchema>;
