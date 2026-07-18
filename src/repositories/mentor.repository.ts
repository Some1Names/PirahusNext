import { prisma } from "@/src/lib/prisma";
import { Prisma } from "@/prisma/generated/client";

import { ICreateMentor, IMentor } from "@/src/core/domain/mentor";

export type MentorWithRelations = Prisma.MentorGetPayload<{
  include: { hints: true; mentee: true };
}>;

import { IMentorRepository } from "@/src/core/ports/server/mentor.repository.port";
import { mapToDomainMentor } from "@/src/factories/mentor.factory";

export class MentorRepository implements IMentorRepository {
  async createMentor(data: ICreateMentor): Promise<IMentor> {
    const mentor = await prisma.mentor.create({
      data: { studentId: data.studentId },
      include: { hints: true, mentee: true },
    });
    return mapToDomainMentor(mentor);
  }

  async createMany(data: ICreateMentor[]): Promise<IMentor[]> {
    await prisma.mentor.createMany({ data, skipDuplicates: true });
    const mentors = await prisma.mentor.findMany({
      include: { hints: true, mentee: true },
    });
    return mentors.map(mapToDomainMentor);
  }

  async findAll(): Promise<IMentor[]> {
    const mentors = await prisma.mentor.findMany({
      include: { hints: true, mentee: true },
      orderBy: { studentId: "asc" },
    });
    return mentors.map(mapToDomainMentor);
  }

  async findById(id: string): Promise<IMentor | null> {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: { hints: true, mentee: true },
    });
    return mentor ? mapToDomainMentor(mentor) : null;
  }

  async findByStudentId(studentId: string): Promise<IMentor | null> {
    const mentor = await prisma.mentor.findUnique({
      where: { studentId },
      include: { hints: true, mentee: true },
    });
    return mentor ? mapToDomainMentor(mentor) : null;
  }

  async update(id: string, data: Partial<IMentor>): Promise<IMentor> {
    const mentor = await prisma.mentor.update({
      where: { id },
      data: {
        studentId: data.studentId,
        nickname: data.nickname,
        isAdmin: data.isAdmin,
        point: data.point,
        unlockedCosmetics: data.unlockedCosmetics,
        equippedEffect: data.equippedEffect,
      },
      include: { hints: true, mentee: true },
    });
    return mapToDomainMentor(mentor);
  }

  async setAdminRole(id: string, isAdmin: boolean): Promise<IMentor> {
    const mentor = await prisma.mentor.update({
      where: { id },
      data: { isAdmin },
      include: { hints: true, mentee: true },
    });
    return mapToDomainMentor(mentor);
  }

  async delete(id: string): Promise<IMentor> {
    const mentor = await prisma.mentor.delete({
      where: { id },
      include: { hints: true, mentee: true },
    });
    return mapToDomainMentor(mentor);
  }

  async getPoint(id: string): Promise<IMentor | null> {
    const mentor = await prisma.mentor.findUnique({
      where: { id },
      include: { hints: true, mentee: true },
    });
    return mentor ? mapToDomainMentor(mentor) : null;
  }

  async setPoint(id: string, point: number): Promise<IMentor> {
    const mentor = await prisma.mentor.update({
      where: { id },
      data: { point },
      include: { hints: true, mentee: true },
    });
    return mapToDomainMentor(mentor);
  }
}
