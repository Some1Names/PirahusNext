import { AuthRepository } from "@/src/repositories/auth.repository";
import { AdmissionYearRepository } from "@/src/repositories/admission-year.repository";
import { MentorRepository } from "@/src/repositories/mentor.repository";
import { MenteeRepository } from "@/src/repositories/mentee.repository";
import { NotFoundError, UnauthorizedError } from "@/src/core/error/error";
import { LoginResponse, SetupProfileResponse } from "@/src/core/domain/auth";
import { Role, CurrentUser } from "@/src/core/domain/user";
import { IMentor } from "@/src/core/domain/mentor";
import { IMentee } from "@/src/core/domain/mentee";
import { IAuthRepository } from "@/src/core/ports/server/auth.repository.port";
import { IAdmissionYearRepository } from "@/src/core/ports/server/admission-year.repository.port";
import { IMentorRepository } from "@/src/core/ports/server/mentor.repository.port";
import { IMenteeRepository } from "@/src/core/ports/server/mentee.repository.port";

export class AuthService {
  constructor(
    private readonly authRepo: IAuthRepository = new AuthRepository(),
    private readonly admissionYearRepo: IAdmissionYearRepository = new AdmissionYearRepository(),
    private readonly mentorRepo: IMentorRepository = new MentorRepository(),
    private readonly menteeRepo: IMenteeRepository = new MenteeRepository(),
  ) {}

  async login(studentId: string, password?: string): Promise<LoginResponse> {
    const config = await this.admissionYearRepo.findFirst();
    if (!config) throw new Error("Admission year setting not configured");

    let user: IMentor | IMentee | null = null;
    let userType: "mentor" | "mentee" = "mentor";

    if (studentId.startsWith(config.mentorYear)) {
      user = await this.mentorRepo.findByStudentId(studentId);
      userType = "mentor";
      if (!user) throw new NotFoundError("Mentor not found");
    } else if (studentId.startsWith(config.menteeYear)) {
      user = await this.menteeRepo.findByStudentId(studentId);
      userType = "mentee";
      if (!user) throw new NotFoundError("Mentee not found");
    } else {
      throw new Error("Invalid Student ID format for mentors or mentees");
    }

    const isFirstLogin = user.password === null;

    if (isFirstLogin) {
      const role: Role =
        userType === "mentor"
          ? (user as IMentor).isAdmin
            ? "admin"
            : "mentor"
          : "mentee";
      await this.authRepo.setTokenCookie(studentId, role, user.point);
      return { studentId, firstLogin: true };
    }

    if (!password) {
      return { studentId, firstLogin: false, hasPassword: true };
    }

    const isValid = this.authRepo.comparePassword(password, user.password!);
    if (!isValid) throw new UnauthorizedError("Incorrect password");

    const role: Role =
      userType === "mentor"
        ? (user as IMentor).isAdmin
          ? "admin"
          : "mentor"
        : "mentee";
    await this.authRepo.setTokenCookie(studentId, role, user.point);
    return { studentId, firstLogin: false };
  }

  async me(tokenPayload: {
    studentId: string;
    role: Role;
  }): Promise<CurrentUser> {
    const { studentId, role } = tokenPayload;

    if (role === "admin" || role === "mentor") {
      const mentor = await this.authRepo.findMentorForMe(studentId);
      if (!mentor) throw new NotFoundError("Mentor not found");

      const currentRole = mentor.role;

      if (role !== currentRole) {
        await this.authRepo.setTokenCookie(
          studentId,
          currentRole,
          mentor.point,
        );
      }

      const { ...userData } = mentor;
      return { ...userData, mentee: mentor.mentee || null, role: currentRole };
    }

    const mentee = await this.authRepo.findMenteeForMe(studentId);
    if (!mentee) throw new NotFoundError("Mentee not found");

    const currentRole = "mentee" as const;
    if (role !== currentRole) {
      await this.authRepo.setTokenCookie(studentId, currentRole, mentee.point);
    }

    return { ...mentee, role: currentRole };
  }

  async setupProfile(
    studentId: string,
    role: Role,
    password: string,
    nickname: string,
  ): Promise<SetupProfileResponse> {
    const hashed = this.authRepo.hashPassword(password);

    if (role === "admin" || role === "mentor") {
      await this.authRepo.updateMentorPassword(studentId, hashed, nickname);
    } else {
      const lastThree = studentId.slice(-3);
      const formattedNickname = `${lastThree} ${nickname}`;
      await this.authRepo.updateMenteePassword(
        studentId,
        hashed,
        formattedNickname,
      );
    }

    return { message: "Password setup successfully" };
  }
  async updateNickname(
    studentId: string,
    role: Role,
    nickname: string
  ): Promise<{ message: string }> {
    if (role === "admin" || role === "mentor") {
      const mentor = await this.mentorRepo.findByStudentId(studentId);
      if (mentor) {
        await this.mentorRepo.update(mentor.id, { nickname });
      }
    } else {
      const lastThree = studentId.slice(-3);
      const formattedNickname = `${lastThree} ${nickname}`;
      const mentee = await this.menteeRepo.findByStudentId(studentId);
      if (mentee) {
        await this.menteeRepo.update(mentee.id, { nickname: formattedNickname });
      }
    }
    return { message: "Profile updated successfully" };
  }
}
