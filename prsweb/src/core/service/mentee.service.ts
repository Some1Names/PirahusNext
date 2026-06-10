import { IMenteeRepository } from "../ports/mentee.repository";
import { IMentee, ICreateMentee, IUpdateMentee } from "../domain/mentee";
import { parseSchema } from "@/src/lib/validation";
import { createMenteeSchema, updateMenteeSchema } from "../schema/mentee";

export class MenteeService {
  constructor(private readonly menteeRepository: IMenteeRepository) {}

  async createMentee(data: ICreateMentee): Promise<IMentee> {
    try {
      const parsedData = parseSchema(createMenteeSchema, data);
      const mentee = await this.menteeRepository.createMentee(parsedData);
      return mentee.data;
    } catch (error) {
      throw error;
    }
  }
  async createManyMentees(data: ICreateMentee[]): Promise<IMentee[]> {
    try {
      const parsedData = data.map((d) => parseSchema(createMenteeSchema, d));
      const mentees = await this.menteeRepository.createManyMentees(parsedData);
      return mentees.data;
    } catch (error) {
      throw error;
    }
  }
  async updateMentee(data: IUpdateMentee): Promise<IMentee> {
    try {
      const parsedData = parseSchema(updateMenteeSchema, data);
      const mentee = await this.menteeRepository.updateMentee(parsedData);
      return mentee.data;
    } catch (error) {
      throw error;
    }
  }
  async deleteMentee(id: string): Promise<IMentee> {
    try {
      const mentee = await this.menteeRepository.deleteMentee(id);
      return mentee.data;
    } catch (error) {
      throw error;
    }
  }
  async getMenteeById(id: string): Promise<IMentee> {
    try {
      const mentee = await this.menteeRepository.getMenteeById(id);
      return mentee.data;
    } catch (error) {
      throw error;
    }
  }
  async getAllMentees(): Promise<IMentee[]> {
    try {
      const mentees = await this.menteeRepository.getAllMentees();
      return mentees.data;
    } catch (error) {
      throw error;
    }
  }
}
