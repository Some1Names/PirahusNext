import { MentorRepository } from "@/src/repositories/mentor.repository";
import { ICreateMentor } from "@/src/core/domain/mentor";
import { NotFoundError } from "@/src/core/error/error";
import { IMentorRepository } from "@/src/core/ports/server/mentor.repository.port";
import { stripMentorPassword, SafeMentor } from "@/src/lib/user-utils";

export class MentorService {
  constructor(
    private readonly mentorRepo: IMentorRepository = new MentorRepository(),
  ) {}

  async createMentor(data: ICreateMentor): Promise<SafeMentor> {
    return stripMentorPassword(await this.mentorRepo.createMentor(data));
  }

  async createMany(data: ICreateMentor[]): Promise<SafeMentor[]> {
    const mentors = await this.mentorRepo.createMany(data);
    return mentors.map(stripMentorPassword);
  }

  async findAll(): Promise<SafeMentor[]> {
    const mentors = await this.mentorRepo.findAll();
    return mentors.map(stripMentorPassword);
  }

  async findById(id: string): Promise<SafeMentor> {
    const mentor = await this.mentorRepo.findById(id);
    if (!mentor) throw new NotFoundError("Mentor not found");
    return stripMentorPassword(mentor);
  }

  async update(id: string, data: { studentId?: string }): Promise<SafeMentor> {
    return stripMentorPassword(await this.mentorRepo.update(id, data));
  }

  async setAdminRole(id: string, isAdmin: boolean): Promise<SafeMentor> {
    return stripMentorPassword(await this.mentorRepo.setAdminRole(id, isAdmin));
  }

  async delete(id: string): Promise<SafeMentor> {
    return stripMentorPassword(await this.mentorRepo.delete(id));
  }

  async getPoint(id: string): Promise<number> {
    const mentor = await this.mentorRepo.getPoint(id);
    if (!mentor) throw new NotFoundError("Mentor not found");
    return mentor.point;
  }

  async setPoint(id: string, point: number): Promise<number> {
    const updated = await this.mentorRepo.setPoint(id, point);
    if (!updated) throw new NotFoundError("Mentor not found");
    return updated.point;
  }
}
