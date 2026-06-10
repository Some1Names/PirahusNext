import { parseSchema } from "@/src/lib/validation";
import {
  CreateAdmissionYearSchema,
  UpdateAdmissionYearSchema,
} from "../schema/admission-year";
import {
  CreateAdmissionYear,
  UpdateAdmissionYear,
} from "../domain/admission-year";
import { IAdmissionYearRepository } from "../ports/admission-year.repository";

export class AdmissionYearService {
  constructor(private admissionYearRepository: IAdmissionYearRepository) {}

  async createAdmissionYear(data: CreateAdmissionYear) {
    const parsedData = parseSchema(CreateAdmissionYearSchema, data);
    return await this.admissionYearRepository.createAdmissionYear(parsedData);
  }
  async updateAdmissionYear(data: UpdateAdmissionYear) {
    const parsedData = parseSchema(UpdateAdmissionYearSchema, data);
    return await this.admissionYearRepository.updateAdmissionYear(parsedData);
  }
  async getAdmissionYear() {
    return await this.admissionYearRepository.getAdmissionYear();
  }
}
