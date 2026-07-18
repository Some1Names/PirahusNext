import { ApiResponse } from "@/src/core/interface/response";
import {
  Login,
  LoginResponse,
  SetupProfileResponse,
} from "@/src/core/domain/auth";
import { CurrentUser, Role } from "@/src/core/domain/user";
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/src/core/domain/profile";
import httpClient from "@/src/lib/http";

import { IAuthClientRepository } from "@/src/core/ports/client/auth.repository.port";

export class AuthClientRepository implements IAuthClientRepository {
  async login(loginData: Login): Promise<ApiResponse<LoginResponse>> {
    return httpClient.post<LoginResponse>("/api/auth/login", loginData);
  }

  async me(): Promise<ApiResponse<CurrentUser>> {
    return httpClient.get<CurrentUser>("/api/auth/me");
  }

  async setupProfile(
    password: string,
    nickname: string,
  ): Promise<ApiResponse<SetupProfileResponse>> {
    return httpClient.post<SetupProfileResponse>("/api/auth/setupprofile", {
      password,
      nickname,
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    return httpClient.post<null>("/api/auth/logout");
  }

  async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<ApiResponse<UpdateProfileResponse>> {
    return httpClient.put<UpdateProfileResponse>("/api/auth/profile", data);
  }

  async deletePassword(id: string, role: Role): Promise<ApiResponse<void>> {
    return httpClient.delete<void>("/api/auth/password", { data: { id, role } });
  }
}
