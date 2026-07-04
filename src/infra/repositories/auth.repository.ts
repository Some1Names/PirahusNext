import { ApiResponse } from "../interface/response";
import { IAuthRepository } from "../../core/ports/auth.repository";
import {
  CurrentUser,
  Login,
  LoginResponse,
  SetupProfileResponse,
} from "../../core/domain/auth";
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
      const response = await httpClient.get<CurrentUser>(`/api/auth/me?_t=${Date.now()}`);
      return response;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }
  async setupProfile(
    password: string,
    nickname: string
  ): Promise<ApiResponse<SetupProfileResponse>> {
    try {
      const response = await httpClient.post<SetupProfileResponse>(
        "/api/auth/setupprofile",
        { password, nickname },
      );
      return response;
    } catch (error) {
      console.error("Setup profile error:", error);
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
