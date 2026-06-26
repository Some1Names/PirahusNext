import { ApiResponse } from "../interface/response";
import { IAuthRepository } from "../../core/ports/auth.repository";
import { CurrentUser, Login, LoginResponse, SetupPasswordResponse } from "../../core/domain/auth";
import httpClient from "@/src/lib/http";

export class AuthRepository implements IAuthRepository {
  async login(loginData: Login): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await httpClient.post<LoginResponse>(
        "/api/auth/login",
        loginData,
      );
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
  async me(): Promise<ApiResponse<CurrentUser>> {
    try {
      const response =
        await httpClient.get<CurrentUser>("/api/auth/me");
      return response;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }
  async setupPassword(
    password: string,
  ): Promise<ApiResponse<SetupPasswordResponse>> {
    try {
      const response = await httpClient.post<SetupPasswordResponse>(
        "/api/auth/password",
        { password },
      );
      return response;
    } catch (error) {
      console.error("Setup password error:", error);
      throw error;
    }
  }
  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await httpClient.post<null>("/api/auth/logout");
      return response;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
}
