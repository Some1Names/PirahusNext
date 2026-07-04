import { prisma } from "@/src/lib/prisma";
import { Mentor, Prisma } from "@/prisma/generated/client";

import { ICreateMentor } from "@/src/core/domain/mentor";

export type MentorWithRelations = Prisma.MentorGetPayload<{
  include: { hints: true; mentee: true };
}>;

export class MentorRepository {
  async createMentor(data: ICreateMentor): Promise<MentorWithRelations> {
    return prisma.mentor.create({
      data: { studentId: data.studentId },
      include: { hints: true, mentee: true },
    });
  }

  async createMany(data: ICreateMentor[]): Promise<MentorWithRelations[]> {
    await prisma.mentor.createMany({ data, skipDuplicates: true });
    const mentors = await prisma.mentor.findMany({
      include: { hints: true, mentee: true },
    });
    return mentors;
  }

  async findAll(): Promise<MentorWithRelations[]> {
    return prisma.mentor.findMany({
      include: { hints: true, mentee: true },
      orderBy: { studentId: "asc" },
    });
  }

  async findById(id: string): Promise<MentorWithRelations | null> {
    return prisma.mentor.findUnique({
      where: { id },
      include: { hints: true, mentee: true },
    });
  }

  async findByStudentId(studentId: string): Promise<Mentor | null> {
    return prisma.mentor.findUnique({ where: { studentId } });
  }

  async update(id: string, data: Partial<Mentor>): Promise<MentorWithRelations> {
    return prisma.mentor.update({
      where: { id },
      data,
      include: { hints: true, mentee: true },
    });
  }

  async setAdminRole(id: string, isAdmin: boolean): Promise<MentorWithRelations> {
    return prisma.mentor.update({
      where: { id },
      data: { isAdmin },
      include: { hints: true, mentee: true },
    });
  }

  async delete(id: string): Promise<MentorWithRelations> {
    return prisma.mentor.delete({
      where: { id },
      include: { hints: true, mentee: true },
    });
  }

  async getPoint(id: string): Promise<Mentor | null> {
    return prisma.mentor.findUnique({ where: { id } });
  }

  async addPoint(id: string, point: number): Promise<Mentor> {
    return prisma.mentor.update({
      where: { id },
      data: { point: { increment: point } },
    });
  }
}
