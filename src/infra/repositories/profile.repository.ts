import { ApiResponse } from "../interface/response";
import { IProfileRepository } from "../../core/ports/profile.repository";
import { UpdateProfileRequest, UpdateProfileResponse } from "../../core/domain/profile";
import httpClient from "@/src/lib/http";

export class ProfileRepository implements IProfileRepository {
  async updateProfile(
    data: UpdateProfileRequest
  ): Promise<ApiResponse<UpdateProfileResponse>> {
    try {
      const response = await httpClient.put<UpdateProfileResponse>(
        "/api/profile",
        data,
      );
      return response;
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  }
}
