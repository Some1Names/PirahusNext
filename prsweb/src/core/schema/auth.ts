import { z } from "zod";

export const loginSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  password: z.string().optional().nullable(),
});

export const setupPasswordSchema = z.object({
  password: z.string().min(4, "Password must be at least 4 characters long"),
});
