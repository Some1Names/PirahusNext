import { IUpdateHints, IHint } from "@/src/core/domain/hint";

export interface IHintRepository {
  addHints(
    mentorId: string,
    hints: { content: string; level: number }[],
  ): Promise<{ count: number }>;
  findById(id: string): Promise<IHint | null>;
  findByMentorId(mentorId: string): Promise<IHint[]>;
  update(id: string, data: IUpdateHints): Promise<IHint>;
  delete(id: string): Promise<IHint>;
}
