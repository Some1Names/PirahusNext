import { parseSchema } from "@/src/lib/validation";
import {
  IHint,
  IAddHints,
  IUpdateHints,
  IMenteeHint,
  IUnlockHintResult,
} from "@/src/core/domain/hint";
import { IHintClientRepository } from "@/src/core/ports/client/hint.repository.port";
import { addHintsSchema, updateHintsSchema } from "@/src/core/schema/hint";

export class HintService {
  constructor(private readonly hintRepository: IHintClientRepository) {}
  async addHints(data: IAddHints): Promise<{ count: number }> {
    const parsedData = parseSchema(addHintsSchema, data);
    const res = await this.hintRepository.addHints(parsedData);
    return res.data;
  }
  async updateHints(id: string, data: IUpdateHints): Promise<IHint> {
    const parsedData = parseSchema(updateHintsSchema, data);
    const res = await this.hintRepository.updateHints(id, parsedData);
    return res.data;
  }
  async deleteHint(id: string): Promise<IHint> {
    const res = await this.hintRepository.deleteHint(id);
    return res.data;
  }
  async getHintsByMentorId(mentorId: string): Promise<IHint[]> {
    const res = await this.hintRepository.getHintsByMentorId(mentorId);
    return res.data;
  }
  async getHintByLevel(level: number): Promise<IHint[]> {
    const res = await this.hintRepository.getHintByLevel(level);
    return res.data;
  }
  async getMenteeHints(): Promise<IMenteeHint[]> {
    const res = await this.hintRepository.getMenteeHints();
    return res.data;
  }
  async unlockHint(level: number): Promise<IUnlockHintResult> {
    const res = await this.hintRepository.unlockHint(level);
    return res.data;
  }
}
