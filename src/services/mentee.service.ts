import { MenteeRepository } from "@/src/repositories/mentee.repository";
import { ICreateMentee, IMentee } from "@/src/core/domain/mentee";
import { NotFoundError, ForbiddenError } from "@/src/core/error/error";
import { IMenteeRepository } from "@/src/core/ports/server/mentee.repository.port";
import { stripMenteePassword } from "@/src/lib/user-utils";

type SafeMentee = Omit<IMentee, "password">;

export class MenteeService {
  constructor(
    private readonly menteeRepo: IMenteeRepository = new MenteeRepository(),
  ) {}

  async createMentee(data: ICreateMentee): Promise<SafeMentee> {
    return stripMenteePassword(await this.menteeRepo.createMentee(data));
  }

  async createMany(data: ICreateMentee[]): Promise<SafeMentee[]> {
    const mentees = await this.menteeRepo.createMany(data);
    return mentees.map(stripMenteePassword);
  }

  async findAll(): Promise<SafeMentee[]> {
    const mentees = await this.menteeRepo.findAll();
    return mentees.map(stripMenteePassword);
  }

  async update(id: string, data: { studentId?: string }): Promise<SafeMentee> {
    return stripMenteePassword(await this.menteeRepo.update(id, data));
  }

  async findById(id: string): Promise<SafeMentee> {
    const mentee = await this.menteeRepo.findById(id);
    if (!mentee) throw new NotFoundError("Mentee not found");
    return stripMenteePassword(mentee);
  }

  async delete(id: string): Promise<SafeMentee> {
    return stripMenteePassword(await this.menteeRepo.delete(id));
  }

  async getPoint(id: string): Promise<number> {
    const mentee = await this.menteeRepo.getPoint(id);
    if (!mentee) throw new NotFoundError("Mentee not found");
    return mentee.point;
  }

  async addPoint(
    id: string,
    point: number,
    sessionStudentId?: string,
    sessionRole?: string,
  ): Promise<number> {
    if (sessionRole === "mentee" && sessionStudentId) {
      const mentee = await this.menteeRepo.findByStudentId(sessionStudentId);
      if (!mentee || (mentee.id !== id && mentee.studentId !== id)) {
        throw new ForbiddenError("You can only modify your own points");
      }
    }
    const updated = await this.menteeRepo.addPoint(id, point);
    if (!updated) throw new NotFoundError("Mentee not found");
    return updated.point;
  }
}
