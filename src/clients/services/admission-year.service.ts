import { parseSchema } from "@/src/lib/validation";
import {
  CreateAdmissionYearSchema,
  UpdateAdmissionYearSchema,
} from "@/src/core/schema/admission-year";
import {
  CreateAdmissionYear,
  UpdateAdmissionYear,
} from "@/src/core/domain/admission-year";
import { IAdmissionYearClientRepository } from "@/src/core/ports/client/admission-year.repository.port";

export class AdmissionYearService {
  constructor(
    private admissionYearRepository: IAdmissionYearClientRepository,
  ) {}

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
