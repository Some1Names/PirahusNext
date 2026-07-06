import { ProfileRepository } from "@/src/repositories/profile.repository";
import { Role } from "@/src/core/domain/user";
import { IProfileRepository } from "@/src/core/ports/server/profile.repository.port";



export class ProfileService {
  constructor(
    private readonly profileRepo: IProfileRepository = new ProfileRepository()
  ) {}

  async updateNickname(
    studentId: string,
    role: Role,
    nickname: string
  ): Promise<{ message: string }> {
    if (role === "admin" || role === "mentor") {
      await this.profileRepo.updateMentorNickname(studentId, nickname);
    } else {
      const lastThree = studentId.slice(-3);
      const formattedNickname = `${lastThree} ${nickname}`;
      await this.profileRepo.updateMenteeNickname(studentId, formattedNickname);
    }
    return { message: "Profile updated successfully" };
  }
}
