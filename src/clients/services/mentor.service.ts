import { IMentorClientRepository } from "@/src/core/ports/client/mentor.repository.port";
import { IMentor, ICreateMentor } from "@/src/core/domain/mentor";
import { parseSchema } from "@/src/lib/validation";
import { createMentorSchema } from "@/src/core/schema/mentor";

export class MentorService {
  constructor(private readonly mentorRepository: IMentorClientRepository) {}

  async createMentor(data: ICreateMentor): Promise<IMentor> {
    const parsedData = parseSchema(createMentorSchema, data);
    const mentor = await this.mentorRepository.createMentor(parsedData);
    return mentor.data;
  }

  async createManyMentors(data: ICreateMentor[]): Promise<IMentor[]> {
    const parsedData = data.map((d) => parseSchema(createMentorSchema, d));
    const mentors = await this.mentorRepository.createManyMentors(parsedData);
    return mentors.data;
  }

  async deleteMentor(id: string): Promise<IMentor> {
    const mentor = await this.mentorRepository.deleteMentor(id);
    return mentor.data;
  }
  async getMentorById(id: string): Promise<IMentor> {
    const mentor = await this.mentorRepository.getMentorById(id);
    return mentor.data;
  }
  async getAllMentors(): Promise<IMentor[]> {
    const mentors = await this.mentorRepository.getAllMentors();
    return mentors.data;
  }

  async setAdminRole(id: string, isAdmin: boolean): Promise<IMentor> {
    const mentor = await this.mentorRepository.setAdminRole(id, isAdmin);
    return mentor.data;
  }
  async getMentorPoint(mentorId: string): Promise<number> {
    const res = await this.mentorRepository.getMentorPoint(mentorId);
    return res.data;
  }
  async addMentorPoint(mentorId: string, point: number): Promise<number> {
    const res = await this.mentorRepository.addMentorPoint(mentorId, point);
    return res.data;
  }
}
