import { IMentorRepository } from "../ports/mentor.repository";
import {
  IMentor,
  ICreateMentor,
  IUpdateMentor,
  IAddHints,
  IUpdateHints,
} from "../domain/mentor";
import { parseSchema } from "@/src/lib/validation";
import {
  createMentorSchema,
  updateMentorSchema,
  addHintsSchema,
  updateHintsSchema,
} from "../schema/mentor";

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

  async updateMentor(data: IUpdateMentor): Promise<IMentor> {
    try {
      const parsedData = parseSchema(updateMentorSchema, data);
      const mentor = await this.mentorRepository.updateMentor(parsedData);
      return mentor.data;
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
  async addHints(mentorId: string, data: IAddHints): Promise<IMentor> {
    try {
      const parsedData = parseSchema(addHintsSchema, data);
      const mentor = await this.mentorRepository.addHints(mentorId, parsedData);
      return mentor.data;
    } catch (error) {
      throw error;
    }
  }
  async updateHints(mentorId: string, data: IUpdateHints): Promise<IMentor> {
    try {
      const parsedData = parseSchema(updateHintsSchema, data);
      const mentor = await this.mentorRepository.updateHints(
        mentorId,
        parsedData,
      );
      return mentor.data;
    } catch (error) {
      throw error;
    }
  }
}
