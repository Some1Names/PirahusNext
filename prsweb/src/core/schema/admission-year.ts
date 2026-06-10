import { z } from "zod";

export const CreateAdmissionYearSchema = z.object({
  mentorYear: z.string(),
  menteeYear: z.string(),
});

export const UpdateAdmissionYearSchema = z.object({
  mentorYear: z.string(),
  menteeYear: z.string(),
});
