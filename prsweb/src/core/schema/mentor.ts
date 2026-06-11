import { z } from "zod";

export const createMentorSchema = z.object({
  studentId: z.string().min(1),
});

export type CreateMentorInput = z.infer<typeof createMentorSchema>;

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
