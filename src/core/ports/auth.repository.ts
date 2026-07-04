import { ApiResponse } from "@/src/infra/interface/response";
import { Login, LoginResponse, CurrentUser } from "../domain/auth";
import { SetupProfileResponse } from "../domain/auth";

export interface IAuthRepository {
  login(loginData: Login): Promise<ApiResponse<LoginResponse>>;
  me(): Promise<ApiResponse<CurrentUser>>;
  setupProfile(
    password: string,
    nickname: string,
  ): Promise<ApiResponse<SetupProfileResponse>>;
  logout(): Promise<ApiResponse<null>>;
}
