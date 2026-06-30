import { IMentorRepository } from "../ports/mentor.repository";
import { IMentor, ICreateMentor } from "../domain/mentor";
import { parseSchema } from "@/src/lib/validation";
import { createMentorSchema } from "../schema/mentor";

export class MentorService {
  constructor(private readonly mentorRepository: IMentorRepository) {}

  async createMentor(data: ICreateMentor): Promise<IMentor> {
    try {
      const parsedData = parseSchema(createMentorSchema, data);
      const mentor = await this.mentorRepository.createMentor(parsedData);
      return mentor.data;
    } catch (error) {
      throw error;
    }
  }

  async createManyMentors(data: ICreateMentor[]): Promise<IMentor[]> {
    try {
      const parsedData = data.map((d) => parseSchema(createMentorSchema, d));
      const mentors = await this.mentorRepository.createManyMentors(parsedData);
      return mentors.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteMentor(id: string): Promise<IMentor> {
    try {
      const mentor = await this.mentorRepository.deleteMentor(id);
      return mentor.data;
    } catch (error) {
      throw error;
    }
  }
  async getMentorById(id: string): Promise<IMentor> {
    try {
      const mentor = await this.mentorRepository.getMentorById(id);
      return mentor.data;
    } catch (error) {
      throw error;
    }
  }
  async getAllMentors(): Promise<IMentor[]> {
    try {
      const mentors = await this.mentorRepository.getAllMentors();
      return mentors.data;
    } catch (error) {
      throw error;
    }
  }

  async setAdminRole(id: string, isAdmin: boolean): Promise<IMentor> {
    try {
      const mentor = await this.mentorRepository.setAdminRole(id, isAdmin);
      return mentor.data;
    } catch (error) {
      throw error;
    }
  }
  async getMentorPoint(mentorId: string): Promise<number> {
    try {
      const res = await this.mentorRepository.getMentorPoint(mentorId);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  async addMentorPoint(mentorId: string, point: number): Promise<number> {
    try {
      const res = await this.mentorRepository.addMentorPoint(mentorId, point);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
