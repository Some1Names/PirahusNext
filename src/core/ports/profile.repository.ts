import { ApiResponse } from "@/src/infra/interface/response";
import { UpdateProfileRequest, UpdateProfileResponse } from "../domain/profile";

export interface IProfileRepository {
  updateProfile(
    data: UpdateProfileRequest,
  ): Promise<ApiResponse<UpdateProfileResponse>>;
}
