import { ApiResponse } from "@/src/core/interface/response";
import { Login, LoginResponse, SetupProfileResponse } from "@/src/core/domain/auth";
import { CurrentUser } from "@/src/core/domain/user";

export interface IAuthClientRepository {
  login(loginData: Login): Promise<ApiResponse<LoginResponse>>;
  me(): Promise<ApiResponse<CurrentUser>>;
  setupProfile(password: string, nickname: string): Promise<ApiResponse<SetupProfileResponse>>;
  logout(): Promise<ApiResponse<null>>;
}
