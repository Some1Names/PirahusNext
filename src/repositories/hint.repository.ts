import { prisma } from "@/src/lib/prisma";
import { IUpdateHints, IHint } from "@/src/core/domain/hint";

import { IHintRepository } from "@/src/core/ports/server/hint.repository.port";

export class HintRepository implements IHintRepository {
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

  async findById(id: string): Promise<IHint | null> {
    return prisma.hint.findUnique({ where: { id } });
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
}
