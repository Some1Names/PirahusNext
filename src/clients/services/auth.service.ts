import { IAuthClientRepository } from "@/src/core/ports/client/auth.repository.port";
import { parseSchema } from "@/src/lib/validation";
import { loginSchema } from "@/src/core/schema/auth";
import {
  Login,
  LoginResponse,
  SetupProfileResponse,
} from "@/src/core/domain/auth";
import { CurrentUser, Role } from "@/src/core/domain/user";
import { updateProfileSchema } from "@/src/core/schema/profile";
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/src/core/domain/profile";

export class AuthService {
  constructor(private readonly authRepository: IAuthClientRepository) {}

  async login(loginData: Login): Promise<LoginResponse> {
    const parsedData = parseSchema(loginSchema, loginData);
    const response = await this.authRepository.login(parsedData);
    return response.data;
  }

  async me(): Promise<CurrentUser | null> {
    try {
      const response = await this.authRepository.me();
      return response.data;
    } catch {
      return null;
    }
  }

  async setupProfile(
    password: string,
    nickname: string,
  ): Promise<SetupProfileResponse> {
    const response = await this.authRepository.setupProfile(password, nickname);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.authRepository.logout();
  }

  async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    const parsedData = parseSchema(updateProfileSchema, data);
    const response = await this.authRepository.updateProfile(parsedData);
    return response.data;
  }

  async deletePassword(id: string, role: Role): Promise<void> {
    await this.authRepository.deletePassword(id, role);
  }
}
