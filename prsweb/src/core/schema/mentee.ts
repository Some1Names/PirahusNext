import { z } from "zod";

export const createMenteeSchema = z.object({
  studentId: z.string().min(1),
  mentorId: z.string().min(1),
});

export type CreateMenteeInput = z.infer<typeof createMenteeSchema>;

export const updateMenteeSchema = z.object({
  id: z.string().min(1),
  studentId: z.string().min(1),
});

export type UpdateMenteeInput = z.infer<typeof updateMenteeSchema>;

export const deleteMenteeSchema = z.object({
  id: z.string().min(1),
});

export type DeleteMenteeInput = z.infer<typeof deleteMenteeSchema>;

export const getMenteeByIdSchema = z.object({
  id: z.string().min(1),
});

export type GetMenteeByIdInput = z.infer<typeof getMenteeByIdSchema>;

export const getAllMenteesSchema = z.object({});

export type GetAllMenteesInput = z.infer<typeof getAllMenteesSchema>;
