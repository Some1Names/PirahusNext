import { IMenteeClientRepository } from "@/src/core/ports/client/mentee.repository.port";
import { IMentee, ICreateMentee } from "@/src/core/domain/mentee";
import { parseSchema } from "@/src/lib/validation";
import { createMenteeSchema } from "@/src/core/schema/mentee";

export class MenteeService {
  constructor(private readonly menteeRepository: IMenteeClientRepository) {}

  async createMentee(data: ICreateMentee): Promise<IMentee> {
    const parsedData = parseSchema(createMenteeSchema, data);
    const mentee = await this.menteeRepository.createMentee(parsedData);
    return mentee.data;
  }
  async createManyMentees(data: ICreateMentee[]): Promise<IMentee[]> {
    const parsedData = data.map((d) => parseSchema(createMenteeSchema, d));
    const mentees = await this.menteeRepository.createManyMentees(parsedData);
    return mentees.data;
  }
  async deleteMentee(id: string): Promise<IMentee> {
    const mentee = await this.menteeRepository.deleteMentee(id);
    return mentee.data;
  }
  async getMenteeById(id: string): Promise<IMentee> {
    const mentee = await this.menteeRepository.getMenteeById(id);
    return mentee.data;
  }
  async getAllMentees(): Promise<IMentee[]> {
    const mentees = await this.menteeRepository.getAllMentees();
    return mentees.data;
  }
  async getMenteePoint(menteeId: string): Promise<number> {
    const res = await this.menteeRepository.getMenteePoint(menteeId);
    return res.data;
  }
  async addMenteePoint(menteeId: string, point: number): Promise<number> {
    const res = await this.menteeRepository.addMenteePoint(menteeId, point);
    return res.data;
  }
}
