import { IProfileRepository } from "../ports/profile.repository";
import { parseSchema } from "@/src/lib/validation";
import { updateProfileSchema } from "../schema/profile";
import { UpdateProfileRequest, UpdateProfileResponse } from "../domain/profile";

export class ProfileService {
  constructor(private readonly profileRepository: IProfileRepository) {}

  async updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      const parsedData = parseSchema(updateProfileSchema, data);
      const response = await this.profileRepository.updateProfile(parsedData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
