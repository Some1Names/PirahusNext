import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";

export interface IPointRepository {
  getMentorPoint(id: string): Promise<IMentor | null>;
  addMentorPoint(id: string, point: number): Promise<IMentor>;
  getMenteePoint(id: string): Promise<IMentee | null>;
  addMenteePoint(id: string, point: number): Promise<IMentee>;
}
