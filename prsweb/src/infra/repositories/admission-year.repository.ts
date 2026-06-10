import { ApiResponse } from "../interface/response";
import httpClient from "@/src/lib/http";
import { IAdmissionYearRepository } from "@/src/core/ports/admission-year.repository";
import {
  IAdmissionYear,
  CreateAdmissionYear,
  UpdateAdmissionYear,
} from "@/src/core/domain/admission-year";

export class AdmissionYearRepository implements IAdmissionYearRepository {
  async getAdmissionYear(): Promise<ApiResponse<IAdmissionYear>> {
    return await httpClient.get("/api/admission-year");
  }
  async createAdmissionYear(
    data: CreateAdmissionYear,
  ): Promise<ApiResponse<IAdmissionYear>> {
    return await httpClient.post("/api/admission-year", data);
  }
  async updateAdmissionYear(
    data: UpdateAdmissionYear,
  ): Promise<ApiResponse<IAdmissionYear>> {
    return await httpClient.put("/api/admission-year", data);
  }
}
