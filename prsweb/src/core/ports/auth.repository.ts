import { ApiResponse } from "@/src/infra/interface/response";
import { Login, LoginResponse, CurrentUser, SetupPasswordResponse } from "../domain/auth";

export interface IAuthRepository {
  login(loginData: Login): Promise<ApiResponse<LoginResponse>>;
  me(): Promise<ApiResponse<CurrentUser>>;
  setupPassword(password: string): Promise<ApiResponse<SetupPasswordResponse>>;
  logout(): Promise<ApiResponse<null>>;
}
