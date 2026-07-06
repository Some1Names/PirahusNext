import { ICreateMentor, IMentor } from "@/src/core/domain/mentor";

export interface IMentorRepository {
  createMentor(data: ICreateMentor): Promise<IMentor>;
  createMany(data: ICreateMentor[]): Promise<IMentor[]>;
  findAll(): Promise<IMentor[]>;
  findById(id: string): Promise<IMentor | null>;
  findByStudentId(studentId: string): Promise<IMentor | null>;
  update(id: string, data: Partial<IMentor>): Promise<IMentor>;
  setAdminRole(id: string, isAdmin: boolean): Promise<IMentor>;
  delete(id: string): Promise<IMentor>;
  getPoint(id: string): Promise<IMentor | null>;
  addPoint(id: string, point: number): Promise<IMentor>;
}
