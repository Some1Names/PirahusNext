import { prisma } from "@/src/lib/prisma";
import { IAdmissionYearRepository } from "@/src/core/ports/server/admission-year.repository.port";
import { IAdmissionYear } from "@/src/core/domain/admission-year";

export class AdmissionYearRepository implements IAdmissionYearRepository {
  async findFirst(): Promise<IAdmissionYear | null> {
    return prisma.admissionYear.findFirst();
  }

  async create(mentorYear: string, menteeYear: string): Promise<IAdmissionYear> {
    return prisma.admissionYear.create({ data: { mentorYear, menteeYear } });
  }

  async update(id: string, data: { mentorYear?: string; menteeYear?: string }): Promise<IAdmissionYear> {
    return prisma.admissionYear.update({ where: { id }, data });
  }
}
