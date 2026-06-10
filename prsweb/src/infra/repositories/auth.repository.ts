import { ApiResponse } from "../interface/response";
import { IAuthRepository } from "../../core/ports/auth.repository";
import { CurrentUser, Login, LoginResponse } from "../../core/domain/auth";
import httpClient from "@/src/lib/http";

export class AuthRepository implements IAuthRepository {
  async login(loginData: Login): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await httpClient.post<ApiResponse<LoginResponse>>(
        "/api/auth/login",
        loginData,
      );
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  }
  async me(): Promise<ApiResponse<CurrentUser>> {
    try {
      const response =
        await httpClient.get<ApiResponse<CurrentUser>>("/api/auth/me");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw new Error("Failed to fetch current user");
    }
  }
}
