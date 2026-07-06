import { IUpdateHints, IHint } from "@/src/core/domain/hint";
import { IMentee } from "@/src/core/domain/mentee";

export interface IHintRepository {
  addHints(
    mentorId: string,
    hints: { content: string; level: number }[],
  ): Promise<{ count: number }>;
  findById(id: string): Promise<IHint | null>;
  findByMentorId(mentorId: string): Promise<IHint[]>;
  update(id: string, data: IUpdateHints): Promise<IHint>;
  delete(id: string): Promise<IHint>;
  findMenteeWithHints(studentId: string): Promise<IMentee | null>;
  unlockHintTransaction(
    menteeId: string,
    level: number,
    cost: number,
  ): Promise<IMentee>;
}
