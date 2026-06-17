import { IAuthRepository } from "../ports/auth.repository";
import { parseSchema } from "@/src/lib/validation";
import { loginSchema } from "../schema/auth";
import { Login, LoginResponse, CurrentUser, SetupPasswordResponse } from "../domain/auth";

export class AuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(loginData: Login): Promise<LoginResponse> {
    try {
      const parsedData = parseSchema(loginSchema, loginData);
      const response = await this.authRepository.login(parsedData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async me(): Promise<CurrentUser> {
    try {
      const response = await this.authRepository.me();
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async setupPassword(password: string): Promise<SetupPasswordResponse> {
    try {
      const response = await this.authRepository.setupPassword(password);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
