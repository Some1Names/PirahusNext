import { parseSchema } from "@/src/lib/validation";
import { IHint, IAddHints, IUpdateHints, IMenteeHint, IUnlockHintResult } from "../domain/hint";
import { IHintRepository } from "../ports/hint.repository";
import { addHintsSchema, updateHintsSchema } from "../schema/hint";

export class HintService {
  constructor(private readonly hintRepository: IHintRepository) {}
  async addHints(data: IAddHints): Promise<{ count: number }> {
    try {
      const parsedData = parseSchema(addHintsSchema, data);
      const res = await this.hintRepository.addHints(parsedData);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  async updateHints(id: string, data: IUpdateHints): Promise<IHint> {
    try {
      const parsedData = parseSchema(updateHintsSchema, data);
      const res = await this.hintRepository.updateHints(id, parsedData);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  async deleteHint(id: string): Promise<IHint> {
    try {
      const res = await this.hintRepository.deleteHint(id);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  async getHintsByMentorId(mentorId: string): Promise<IHint[]> {
    try {
      const res = await this.hintRepository.getHintsByMentorId(mentorId);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  async getHintByLevel(level: number): Promise<IHint[]> {
    try {
      const res = await this.hintRepository.getHintByLevel(level);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  async getMenteeHints(): Promise<IMenteeHint[]> {
    try {
      const res = await this.hintRepository.getMenteeHints();
      return res.data;
    } catch (error) {
      throw error;
    }
  }
  async unlockHint(level: number): Promise<IUnlockHintResult> {
    try {
      const res = await this.hintRepository.unlockHint(level);
      return res.data;
    } catch (error) {
      throw error;
    }
  }
}
