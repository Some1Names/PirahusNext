import { z } from "zod";

export const loginSchema = z.object({
  studentId: z.string().trim().min(1, "Student ID is required"),
  password: z.string().optional().nullable(),
});

export const setupProfileSchema = z.object({
  password: z.string().min(4, "รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร"),
  nickname: z.string().min(1, "กรุณากรอกชื่อเล่น"),
});
