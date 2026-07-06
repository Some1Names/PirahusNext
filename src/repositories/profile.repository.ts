import { prisma } from "@/src/lib/prisma";
import { IProfileRepository } from "@/src/core/ports/server/profile.repository.port";
import { mapToDomainMentor } from "@/src/factories/mentor.factory";
import { mapToDomainMentee } from "@/src/factories/mentee.factory";
import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";

export class ProfileRepository implements IProfileRepository {
  async updateMentorNickname(
    studentId: string,
    nickname: string,
  ): Promise<IMentor> {
    const mentor = await prisma.mentor.update({
      where: { studentId },
      data: { nickname },
      include: { hints: true, mentee: true },
    });
    return mapToDomainMentor(mentor);
  }

  async updateMenteeNickname(
    studentId: string,
    nickname: string,
  ): Promise<IMentee> {
    const mentee = await prisma.mentee.update({
      where: { studentId },
      data: { nickname },
      include: { mentor: { include: { hints: true } } },
    });
    return mapToDomainMentee(mentee);
  }
}
