import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";
import { IAdmissionYear } from "@/src/core/domain/admission-year";
import { MentorUser, MenteeUser, Role } from "@/src/core/domain/user";

export interface IAuthRepository {
  findAdmissionYear(): Promise<IAdmissionYear | null>;
  findMentorByStudentId(studentId: string): Promise<IMentor | null>;
  findMenteeByStudentId(studentId: string): Promise<IMentee | null>;
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
  setTokenCookie(studentId: string, role: Role, point: number): Promise<string>;
  comparePassword(plain: string, hashed: string): boolean;
  hashPassword(plain: string): string;
}
