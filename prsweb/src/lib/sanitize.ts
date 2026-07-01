import { Mentor, Mentee } from "@/prisma/generated/client";

export type SafeMentee = Omit<Mentee, "password">;
export type SafeMentor = Omit<Mentor, "password">;

export type SanitizedMentor<T> = Omit<T, "password" | "mentee"> & { mentee?: SafeMentee | null };
export type SanitizedMentee<T> = Omit<T, "password" | "mentor"> & { mentor?: SafeMentor | null };

export function sanitizeMentor<T extends Mentor & { mentee?: Mentee | null }>(
  mentor: T | null
): SanitizedMentor<T> | null {
  if (!mentor) return mentor as null;
  const { password, mentee, ...rest } = mentor;
  
  const result: Record<string, unknown> = { ...rest };

  if (mentee !== undefined) {
    if (mentee) {
      const { password: menteePassword, ...menteeRest } = mentee;
      result.mentee = menteeRest;
    } else {
      result.mentee = mentee;
    }
  }
  
  return result as unknown as SanitizedMentor<T>;
}

export function sanitizeMentee<T extends Mentee & { mentor?: Mentor | null }>(
  mentee: T | null
): SanitizedMentee<T> | null {
  if (!mentee) return mentee as null;
  const { password, mentor, ...rest } = mentee;
  
  const result: Record<string, unknown> = { ...rest };

  if (mentor !== undefined) {
    if (mentor) {
      const { password: mentorPassword, ...mentorRest } = mentor;
      result.mentor = mentorRest;
    } else {
      result.mentor = mentor;
    }
  }
  
  return result as unknown as SanitizedMentee<T>;
}
