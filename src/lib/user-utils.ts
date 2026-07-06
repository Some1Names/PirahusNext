import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";

/**
 * Removes the password hash from the mentor object before it is returned to the client.
 */
export function stripMentorPassword(mentor: IMentor): Omit<IMentor, "password"> {
  const { password, ...safeMentor } = mentor;
  return safeMentor as Omit<IMentor, "password">;
}

/**
 * Removes the password hash from the mentee object before it is returned to the client.
 */
export function stripMenteePassword(mentee: IMentee): Omit<IMentee, "password"> {
  const { password, ...safeMentee } = mentee;
  return safeMentee as Omit<IMentee, "password">;
}
