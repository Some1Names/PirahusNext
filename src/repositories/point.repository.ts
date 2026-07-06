import { prisma } from "@/src/lib/prisma";
import { NotFoundError } from "@/src/core/error/error";

import { IPointRepository } from "@/src/core/ports/server/point.repository.port";
import { mapToDomainMentor } from "@/src/factories/mentor.factory";
import { mapToDomainMentee } from "@/src/factories/mentee.factory";
import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";

export class PointRepository implements IPointRepository {
  async getMentorPoint(id: string): Promise<IMentor | null> {
    let mentor = await prisma.mentor.findUnique({
      where: { id },
      include: { hints: true, mentee: true },
    });
    if (!mentor) {
      mentor = await prisma.mentor.findUnique({
        where: { studentId: id },
        include: { hints: true, mentee: true },
      });
    }
    return mentor ? mapToDomainMentor(mentor) : null;
  }

  async addMentorPoint(id: string, point: number): Promise<IMentor> {
    let mentor = await prisma.mentor.findUnique({ where: { id } });
    if (!mentor) {
      mentor = await prisma.mentor.findUnique({ where: { studentId: id } });
    }
    if (!mentor) throw new NotFoundError("Mentor not found");
    const updated = await prisma.mentor.update({
      where: { id: mentor.id },
      data: { point: { increment: point } },
      include: { hints: true, mentee: true },
    });
    return mapToDomainMentor(updated);
  }

  async getMenteePoint(id: string): Promise<IMentee | null> {
    let mentee = await prisma.mentee.findUnique({
      where: { id },
      include: { mentor: { include: { hints: true } } },
    });
    if (!mentee) {
      mentee = await prisma.mentee.findUnique({
        where: { studentId: id },
        include: { mentor: { include: { hints: true } } },
      });
    }
    return mentee ? mapToDomainMentee(mentee) : null;
  }

  async addMenteePoint(id: string, point: number): Promise<IMentee> {
    let mentee = await prisma.mentee.findUnique({ where: { id } });
    if (!mentee) {
      mentee = await prisma.mentee.findUnique({ where: { studentId: id } });
    }
    if (!mentee) throw new NotFoundError("Mentee not found");
    const updated = await prisma.mentee.update({
      where: { id: mentee.id },
      data: { point: { increment: point } },
      include: { mentor: { include: { hints: true } } },
    });
    return mapToDomainMentee(updated);
  }
}
