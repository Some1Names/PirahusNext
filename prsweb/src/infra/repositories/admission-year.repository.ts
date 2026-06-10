import { ApiResponse } from "../interface/response";
import httpClient from "@/src/lib/http";
import { ISettingRepository } from "@/src/core/ports/admission-year.repository";
import {
  IAdmissionYear,
  CreateAdmissionYear,
  UpdateAdmissionYear,
} from "@/src/core/domain/admission-year";

export class SettingRepository implements ISettingRepository {
  async getAdmissionYear(): Promise<ApiResponse<IAdmissionYear>> {
    return await httpClient.get("/admission-year");
  }
  async createAdmissionYear(
    data: CreateAdmissionYear,
  ): Promise<ApiResponse<IAdmissionYear>> {
    return await httpClient.post("/admission-year", data);
  }
  async updateAdmissionYear(
    data: UpdateAdmissionYear,
  ): Promise<ApiResponse<IAdmissionYear>> {
    return await httpClient.put("/admission-year", data);
  }
}
