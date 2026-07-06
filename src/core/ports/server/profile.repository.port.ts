import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";

export interface IProfileRepository {
  updateMentorNickname(studentId: string, nickname: string): Promise<IMentor>;
  updateMenteeNickname(studentId: string, nickname: string): Promise<IMentee>;
}
