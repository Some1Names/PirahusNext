import { IAdmissionYear } from "@/src/core/domain/admission-year";

export interface IAdmissionYearRepository {
  findFirst(): Promise<IAdmissionYear | null>;
  create(mentorYear: string, menteeYear: string): Promise<IAdmissionYear>;
  update(id: string, data: { mentorYear?: string; menteeYear?: string }): Promise<IAdmissionYear>;
}
