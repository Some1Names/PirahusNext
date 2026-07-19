import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";

export type SafeMentor = Omit<IMentor, "password"> & { hasPassword: boolean };

export function stripMentorPassword(mentor: IMentor): SafeMentor {
  const { password: _password, ...safeMentor } = mentor;
  return { ...safeMentor, hasPassword: !!_password } as SafeMentor;
}

export type SafeMentee = Omit<IMentee, "password"> & { hasPassword: boolean };

export function stripMenteePassword(mentee: IMentee): SafeMentee {
  const { password: _password, ...safeMentee } = mentee;
  return { ...safeMentee, hasPassword: !!_password } as SafeMentee;
}
