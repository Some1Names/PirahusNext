import { prisma } from "@/src/lib/prisma";
import { IUpdateHints, IHint } from "@/src/core/domain/hint";

export class HintRepository {
  async addHints(
    mentorId: string,
    hints: { content: string; level: number }[],
  ) {
    return prisma.hint.createMany({
      data: hints.map((h) => ({
        content: h.content,
        level: h.level,
        mentorId,
      })),
    });
  }

  async findById(id: string) {
    return prisma.hint.findUnique({ where: { id }, include: { mentor: true } });
  }

  async findByMentorId(mentorId: string): Promise<IHint[]> {
    return prisma.hint.findMany({
      where: { mentorId },
      orderBy: { level: "asc" },
    });
  }

  async update(id: string, data: IUpdateHints): Promise<IHint> {
    return prisma.hint.update({ where: { id }, data });
  }

  async delete(id: string): Promise<IHint> {
    return prisma.hint.delete({ where: { id } });
  }

  async findMenteeWithHints(studentId: string) {
    return prisma.mentee.findUnique({
      where: { studentId },
      include: { mentor: { include: { hints: true } } },
    });
  }

  async unlockHintTransaction(menteeId: string, level: number, cost: number) {
    return prisma.mentee.update({
      where: { id: menteeId },
      data: { point: { decrement: cost }, unlockedHintLevels: { push: level } },
    });
  }
}
