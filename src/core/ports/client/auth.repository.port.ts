import { ApiResponse } from "@/src/core/interface/response";
import { Login, LoginResponse, SetupProfileResponse } from "@/src/core/domain/auth";
import { CurrentUser } from "@/src/core/domain/user";
import { UpdateProfileRequest, UpdateProfileResponse } from "@/src/core/domain/profile";

export interface IAuthClientRepository {
  login(loginData: Login): Promise<ApiResponse<LoginResponse>>;
  me(): Promise<ApiResponse<CurrentUser>>;
  setupProfile(password: string, nickname: string): Promise<ApiResponse<SetupProfileResponse>>;
  updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UpdateProfileResponse>>;
  logout(): Promise<ApiResponse<null>>;
}
