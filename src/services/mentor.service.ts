import { MentorRepository } from "@/src/repositories/mentor.repository";
import { ICreateMentor, IMentor } from "@/src/core/domain/mentor";
import { NotFoundError, ForbiddenError } from "@/src/core/error/error";
import { IMentorRepository } from "@/src/core/ports/server/mentor.repository.port";

export class MentorService {
  constructor(
    private readonly mentorRepo: IMentorRepository = new MentorRepository()
  ) {}

  async createMentor(data: ICreateMentor): Promise<IMentor> {
    return this.mentorRepo.createMentor(data);
  }

  async createMany(data: ICreateMentor[]): Promise<IMentor[]> {
    return this.mentorRepo.createMany(data);
  }

  async findAll(): Promise<IMentor[]> {
    return this.mentorRepo.findAll();
  }

  async findById(id: string): Promise<IMentor> {
    const mentor = await this.mentorRepo.findById(id);
    if (!mentor) throw new NotFoundError("Mentor not found");
    return mentor;
  }

  async update(id: string, data: { studentId?: string }): Promise<IMentor> {
    return this.mentorRepo.update(id, data);
  }

  async setAdminRole(id: string, isAdmin: boolean): Promise<IMentor> {
    return this.mentorRepo.setAdminRole(id, isAdmin);
  }

  async delete(id: string): Promise<IMentor> {
    return this.mentorRepo.delete(id);
  }

  async getPoint(id: string): Promise<number> {
    const mentor = await this.mentorRepo.getPoint(id);
    if (!mentor) throw new NotFoundError("Mentor not found");
    return mentor.point;
  }

  async addPoint(id: string, point: number, sessionStudentId?: string, sessionRole?: string): Promise<number> {
    if (sessionRole === "mentor" && sessionStudentId) {
      const mentor = await this.mentorRepo.findByStudentId(sessionStudentId);
      if (!mentor || (mentor.id !== id && mentor.studentId !== id)) {
        throw new ForbiddenError("You can only modify your own points");
      }
    }
    const updated = await this.mentorRepo.addPoint(id, point);
    if (!updated) throw new NotFoundError("Mentor not found");
    return updated.point;
  }
}
