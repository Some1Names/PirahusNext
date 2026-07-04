import { prisma } from "@/src/lib/prisma";
import { signToken } from "@/src/lib/jwt";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import { Mentor, Mentee, AdmissionYear, Prisma } from "@/prisma/generated/client";
import { Role } from "@/src/core/domain/auth";

export type MentorForMe = Prisma.MentorGetPayload<{
  select: {
    id: true;
    studentId: true;
    nickname: true;
    point: true;
    unlockedCosmetics: true;
    equippedEffect: true;
    isAdmin: true;
    mentee: { select: { id: true; studentId: true; nickname: true } };
  };
}>;

export type MenteeForMe = Prisma.MenteeGetPayload<{
  select: {
    id: true;
    studentId: true;
    nickname: true;
    point: true;
    unlockedHintLevels: true;
    unlockedCosmetics: true;
    equippedEffect: true;
  };
}>;

export class AuthRepository {
  async findAdmissionYear(): Promise<AdmissionYear | null> {
    return prisma.admissionYear.findFirst();
  }

  async findMentorByStudentId(studentId: string): Promise<Mentor | null> {
    return prisma.mentor.findUnique({ where: { studentId } });
  }

  async findMenteeByStudentId(studentId: string): Promise<Mentee | null> {
    return prisma.mentee.findUnique({ where: { studentId } });
  }

  async findMentorForMe(studentId: string): Promise<MentorForMe | null> {
    return prisma.mentor.findUnique({
      where: { studentId },
      select: {
        id: true,
        studentId: true,
        nickname: true,
        point: true,
        unlockedCosmetics: true,
        equippedEffect: true,
        isAdmin: true,
        mentee: { select: { id: true, studentId: true, nickname: true } },
      },
    });
  }

  async findMenteeForMe(studentId: string): Promise<MenteeForMe | null> {
    return prisma.mentee.findUnique({
      where: { studentId },
      select: {
        id: true,
        studentId: true,
        nickname: true,
        point: true,
        unlockedHintLevels: true,
        unlockedCosmetics: true,
        equippedEffect: true,
      },
    });
  }

  async updateMentorPassword(studentId: string, hashedPassword: string, nickname: string): Promise<Mentor> {
    return prisma.mentor.update({
      where: { studentId },
      data: { password: hashedPassword, nickname },
    });
  }

  async updateMenteePassword(studentId: string, hashedPassword: string, nickname: string): Promise<Mentee> {
    return prisma.mentee.update({
      where: { studentId },
      data: { password: hashedPassword, nickname },
    });
  }

  async setTokenCookie(
    studentId: string,
    role: Role,
    point: number
  ): Promise<string> {
    const token = signToken({ studentId, role, point });
    const cookieStore = await cookies();
    cookieStore.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return token;
  }

  comparePassword(plain: string, hashed: string): boolean {
    return bcrypt.compareSync(plain, hashed);
  }

  hashPassword(plain: string): string {
    return bcrypt.hashSync(plain, 10);
  }
}
