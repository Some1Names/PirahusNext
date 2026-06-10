import { z } from "zod";

export const createMentorSchema = z.object({
  studentId: z.string().min(1),
});

export type CreateMentorInput = z.infer<typeof createMentorSchema>;

export const updateMentorSchema = z.object({
  id: z.string().min(1),
  hints: z.array(z.string()).min(1),
});

export type UpdateMentorInput = z.infer<typeof updateMentorSchema>;

export const deleteMentorSchema = z.object({
  id: z.string().min(1),
});

export type DeleteMentorInput = z.infer<typeof deleteMentorSchema>;

export const getMentorByIdSchema = z.object({
  id: z.string().min(1),
});

export type GetMentorByIdInput = z.infer<typeof getMentorByIdSchema>;

export const getAllMentorsSchema = z.object({});

export type GetAllMentorsInput = z.infer<typeof getAllMentorsSchema>;

export const addHintsSchema = z.object({
  hints: z.array(z.string()).min(1),
  mentorId: z.string().min(1),
});

export type AddHintsInput = z.infer<typeof addHintsSchema>;

export const updateHintsSchema = z.object({
  hints: z.array(z.string()).min(1),
  mentorId: z.string().min(1),
});

export type UpdateHintsInput = z.infer<typeof updateHintsSchema>;
