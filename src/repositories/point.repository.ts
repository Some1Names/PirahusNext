import { prisma } from "@/src/lib/prisma";
import { NotFoundError } from "@/src/core/error/error";

export class PointRepository {
  async getMentorPoint(id: string) {
    let mentor = await prisma.mentor.findUnique({ where: { id } });
    if (!mentor) {
      mentor = await prisma.mentor.findUnique({ where: { studentId: id } });
    }
    return mentor;
  }

  async addMentorPoint(id: string, point: number) {
    let mentor = await prisma.mentor.findUnique({ where: { id } });
    if (!mentor) {
      mentor = await prisma.mentor.findUnique({ where: { studentId: id } });
    }
    if (!mentor) throw new NotFoundError("Mentor not found");
    return prisma.mentor.update({
      where: { id: mentor.id },
      data: { point: { increment: point } },
    });
  }

  async getMenteePoint(id: string) {
    let mentee = await prisma.mentee.findUnique({ where: { id } });
    if (!mentee) {
      mentee = await prisma.mentee.findUnique({ where: { studentId: id } });
    }
    return mentee;
  }

  async addMenteePoint(id: string, point: number) {
    let mentee = await prisma.mentee.findUnique({ where: { id } });
    if (!mentee) {
      mentee = await prisma.mentee.findUnique({ where: { studentId: id } });
    }
    if (!mentee) throw new NotFoundError("Mentee not found");
    return prisma.mentee.update({
      where: { id: mentee.id },
      data: { point: { increment: point } },
    });
  }
}
