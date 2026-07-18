import { prisma } from "@/src/lib/prisma";
import { signToken } from "@/src/lib/jwt";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";
import { MentorUser, MenteeUser, Role } from "@/src/core/domain/user";
import { mapToDomainMentor } from "@/src/factories/mentor.factory";
import { mapToDomainMentee } from "@/src/factories/mentee.factory";

import { IAuthRepository } from "@/src/core/ports/server/auth.repository.port";

export class AuthRepository implements IAuthRepository {
  async findMentorForMe(studentId: string): Promise<MentorUser | null> {
    const mentor = await prisma.mentor.findUnique({
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
    if (!mentor) return null;
    return {
      id: mentor.id,
      studentId: mentor.studentId,
      nickname: mentor.nickname,
      point: mentor.point,
      unlockedCosmetics: mentor.unlockedCosmetics,
      equippedEffect: mentor.equippedEffect,
      role: mentor.isAdmin ? "admin" : "mentor",
      mentee: mentor.mentee,
    };
  }

  async findMenteeForMe(studentId: string): Promise<MenteeUser | null> {
    const mentee = await prisma.mentee.findUnique({
      where: { studentId },
      select: {
        id: true,
        studentId: true,
        nickname: true,
        point: true,
        unlockedHintLevels: true,
        unlockedCosmetics: true,
        equippedEffect: true,
        mentor: { select: { studentId: true, nickname: true } },
      },
    });
    if (!mentee) return null;
    return {
      id: mentee.id,
      studentId: mentee.studentId,
      nickname: mentee.nickname,
      point: mentee.point,
      unlockedHintLevels: mentee.unlockedHintLevels,
      unlockedCosmetics: mentee.unlockedCosmetics,
      equippedEffect: mentee.equippedEffect,
      role: "mentee",
      mentor: mentee.mentor,
    };
  }

  async updateMentorPassword(
    studentId: string,
    hashedPassword: string,
    nickname: string,
  ): Promise<IMentor> {
    const mentor = await prisma.mentor.update({
      where: { studentId },
      data: { password: hashedPassword, nickname },
      include: { hints: true, mentee: true },
    });
    return mapToDomainMentor(mentor);
  }

  async updateMenteePassword(
    studentId: string,
    hashedPassword: string,
    nickname: string,
  ): Promise<IMentee> {
    const mentee = await prisma.mentee.update({
      where: { studentId },
      data: { password: hashedPassword, nickname },
      include: { mentor: { include: { hints: true } } },
    });
    return mapToDomainMentee(mentee);
  }

  async deletePassword(id: string, role: Role): Promise<void> {
    if (role === "admin" || role === "mentor") {
      await prisma.mentor.update({
        where: { id },
        data: { password: null },
      });
    } else {
      await prisma.mentee.update({
        where: { id },
        data: { password: null },
      });
    }
  }

  async setTokenCookie(
    studentId: string,
    role: Role,
    point: number,
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
