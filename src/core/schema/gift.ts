import { z } from "zod";

export const giftTransferSchema = z.object({
  recipientCode: z.string().min(1, "Recipient code is required"),
  amount: z.number().int().positive("Amount must be a positive integer"),
});
