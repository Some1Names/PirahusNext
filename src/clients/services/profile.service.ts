import { IProfileClientRepository } from "@/src/core/ports/client/profile.repository.port";
import { parseSchema } from "@/src/lib/validation";
import { updateProfileSchema } from "@/src/core/schema/profile";
import {
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "@/src/core/domain/profile";

export class ProfileService {
  constructor(private readonly profileRepository: IProfileClientRepository) {}

  async updateProfile(
    data: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    const parsedData = parseSchema(updateProfileSchema, data);
    const response = await this.profileRepository.updateProfile(parsedData);
    return response.data;
  }
}
