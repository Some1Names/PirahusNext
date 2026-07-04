import { z } from "zod";

export const updateProfileSchema = z.object({
  nickname: z.string().min(1, "กรุณากรอกชื่อเล่น"),
});
