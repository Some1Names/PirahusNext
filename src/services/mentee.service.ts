import { MenteeRepository } from "@/src/repositories/mentee.repository";
import { ICreateMentee, IMentee } from "@/src/core/domain/mentee";
import { NotFoundError, ForbiddenError } from "@/src/core/error/error";
import { mapToDomainMentee } from "@/src/factories/mentee.factory";

const menteeRepo = new MenteeRepository();

export class MenteeService {
  async createMentee(data: ICreateMentee): Promise<IMentee> {
    const mentee = await menteeRepo.createMentee(data);
    return mapToDomainMentee(mentee);
  }

  async createMany(data: ICreateMentee[]): Promise<IMentee[]> {
    const mentees = await menteeRepo.createMany(data);
    return mentees.map(mapToDomainMentee);
  }

  async findAll(): Promise<IMentee[]> {
    const mentees = await menteeRepo.findAll();
    return mentees.map(mapToDomainMentee);
  }

  async findById(id: string): Promise<IMentee> {
    const mentee = await menteeRepo.findById(id);
    if (!mentee) throw new NotFoundError("Mentee not found");
    return mapToDomainMentee(mentee);
  }

  async delete(id: string): Promise<IMentee> {
    const mentee = await menteeRepo.delete(id);
    return mapToDomainMentee(mentee);
  }

  async getPoint(id: string): Promise<number> {
    const mentee = await menteeRepo.getPoint(id);
    if (!mentee) throw new NotFoundError("Mentee not found");
    return mentee.point;
  }

  async addPoint(id: string, point: number, sessionStudentId?: string, sessionRole?: string): Promise<number> {
    if (sessionRole === "mentee" && sessionStudentId) {
      const mentee = await menteeRepo.findByStudentId(sessionStudentId);
      if (!mentee || (mentee.id !== id && mentee.studentId !== id)) {
        throw new ForbiddenError("You can only modify your own points");
      }
    }
    const updated = await menteeRepo.addPoint(id, point);
    if (!updated) throw new NotFoundError("Mentee not found");
    return updated.point;
  }
}
