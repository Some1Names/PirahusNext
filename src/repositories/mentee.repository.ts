import { prisma } from "@/src/lib/prisma";
import { Mentee, Prisma } from "@/prisma/generated/client";
import { ICreateMentee, IMentee } from "@/src/core/domain/mentee";

export type MenteeWithRelations = Prisma.MenteeGetPayload<{
  include: { mentor: { include: { hints: true } } };
}>;

import { IMenteeRepository } from "@/src/core/ports/server/mentee.repository.port";
import { mapToDomainMentee } from "@/src/factories/mentee.factory";

export class MenteeRepository implements IMenteeRepository {
  async createMentee(data: ICreateMentee): Promise<IMentee> {
    const mentee = await prisma.mentee.create({
      data: {
        studentId: data.studentId,
        mentorId: data.mentorId,
      },
      include: { mentor: { include: { hints: true } } },
    });
    return mapToDomainMentee(mentee);
  }

  async createMany(data: ICreateMentee[]): Promise<IMentee[]> {
    await prisma.mentee.createMany({ data, skipDuplicates: true });
    const mentees = await prisma.mentee.findMany({ include: { mentor: { include: { hints: true } } } });
    return mentees.map(mapToDomainMentee);
  }

  async findAll(): Promise<IMentee[]> {
    const mentees = await prisma.mentee.findMany({
      include: { mentor: { include: { hints: true } } },
    });
    return mentees.map(mapToDomainMentee);
  }

  async findById(id: string): Promise<IMentee | null> {
    const mentee = await prisma.mentee.findUnique({
      where: { id },
      include: { mentor: { include: { hints: true } } },
    });
    return mentee ? mapToDomainMentee(mentee) : null;
  }

  async findByStudentId(studentId: string): Promise<IMentee | null> {
    const mentee = await prisma.mentee.findUnique({ 
      where: { studentId },
      include: { mentor: { include: { hints: true } } },
    });
    return mentee ? mapToDomainMentee(mentee) : null;
  }

  async update(id: string, data: Partial<IMentee>): Promise<IMentee> {
    const mentee = await prisma.mentee.update({ 
      where: { id }, 
      data: {
        studentId: data.studentId,
        nickname: data.nickname,
        point: data.point,
        unlockedHintLevels: data.unlockedHintLevels,
        unlockedCosmetics: data.unlockedCosmetics,
        equippedEffect: data.equippedEffect,
      },
      include: { mentor: { include: { hints: true } } },
    });
    return mapToDomainMentee(mentee);
  }

  async delete(id: string): Promise<IMentee> {
    const mentee = await prisma.mentee.delete({
      where: { id },
      include: { mentor: { include: { hints: true } } },
    });
    return mapToDomainMentee(mentee);
  }

  async getPoint(id: string): Promise<IMentee | null> {
    const mentee = await prisma.mentee.findUnique({ 
      where: { id },
      include: { mentor: { include: { hints: true } } },
    });
    return mentee ? mapToDomainMentee(mentee) : null;
  }

  async addPoint(id: string, point: number): Promise<IMentee> {
    const mentee = await prisma.mentee.update({
      where: { id },
      data: { point: { increment: point } },
      include: { mentor: { include: { hints: true } } },
    });
    return mapToDomainMentee(mentee);
  }
}
