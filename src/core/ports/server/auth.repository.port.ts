import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";
import { MentorUser, MenteeUser, Role } from "@/src/core/domain/user";

export interface IAuthRepository {
  findMentorForMe(studentId: string): Promise<MentorUser | null>;
  findMenteeForMe(studentId: string): Promise<MenteeUser | null>;
  updateMentorPassword(
    studentId: string,
    hashedPassword: string,
    nickname: string,
  ): Promise<IMentor>;
  updateMenteePassword(
    studentId: string,
    hashedPassword: string,
    nickname: string,
  ): Promise<IMentee>;
  deletePassword(id: string, role: Role): Promise<void>;
  setTokenCookie(studentId: string, role: Role, point: number): Promise<string>;
}
