import { Mentor, Mentee } from "@/prisma/generated/client";

export type SafeMentee = Omit<Mentee, "password">;
export type SafeMentor = Omit<Mentor, "password">;

export type SanitizedMentor<T> = Omit<T, "password" | "mentee"> & { mentee?: SafeMentee | null };
export type SanitizedMentee<T> = Omit<T, "password" | "mentor"> & { mentor?: SafeMentor | null };

export function sanitizeMentor<T extends Mentor & { mentee?: Mentee | null }>(
  mentor: T | null
): SanitizedMentor<T> | null {
  if (!mentor) return mentor as null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, mentee, ...rest } = mentor;
  
  const result: Record<string, unknown> = { ...rest };

  if (mentee !== undefined) {
    if (mentee) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _menteePassword, ...menteeRest } = mentee;
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, mentor, ...rest } = mentee;
  
  const result: Record<string, unknown> = { ...rest };

  if (mentor !== undefined) {
    if (mentor) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _mentorPassword, ...mentorRest } = mentor;
      result.mentor = mentorRest;
    } else {
      result.mentor = mentor;
    }
  }
  
  return result as unknown as SanitizedMentee<T>;
}
