import { ICreateMentee, IMentee } from "@/src/core/domain/mentee";

export interface IMenteeRepository {
  createMentee(data: ICreateMentee): Promise<IMentee>;
  createMany(data: ICreateMentee[]): Promise<IMentee[]>;
  findAll(): Promise<IMentee[]>;
  findById(id: string): Promise<IMentee | null>;
  findByStudentId(studentId: string): Promise<IMentee | null>;
  update(id: string, data: Partial<IMentee>): Promise<IMentee>;
  delete(id: string): Promise<IMentee>;
  getPoint(id: string): Promise<IMentee | null>;
  addPoint(id: string, point: number): Promise<IMentee>;
}
