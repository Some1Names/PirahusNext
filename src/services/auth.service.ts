import { AuthRepository } from "@/src/repositories/auth.repository";
import { NotFoundError, UnauthorizedError } from "@/src/core/error/error";
import { Mentor } from "@/prisma/generated/client";
import {
  Role,
  LoginResponse,
  SetupProfileResponse,
  CurrentUser,
} from "@/src/core/domain/auth";
import { IAuthRepository } from "@/src/core/ports/server/auth.repository.port";

export class AuthService {
  constructor(
    private readonly authRepo: IAuthRepository = new AuthRepository(),
  ) {}

  async login(studentId: string, password?: string): Promise<LoginResponse> {
    const config = await this.authRepo.findAdmissionYear();
    if (!config) throw new Error("Admission year setting not configured");

    let user:
      | Mentor
      | Awaited<ReturnType<typeof this.authRepo.findMenteeByStudentId>>
      | null = null;
    let userType: "mentor" | "mentee" = "mentor";

    if (studentId.startsWith(config.mentorYear)) {
      user = await this.authRepo.findMentorByStudentId(studentId);
      userType = "mentor";
      if (!user) throw new NotFoundError("Mentor not found");
    } else if (studentId.startsWith(config.menteeYear)) {
      user = await this.authRepo.findMenteeByStudentId(studentId);
      userType = "mentee";
      if (!user) throw new NotFoundError("Mentee not found");
    } else {
      throw new Error("Invalid Student ID format for mentors or mentees");
    }

    const isFirstLogin = user.password === null;

    if (isFirstLogin) {
      const role: Role =
        userType === "mentor"
          ? (user as Mentor).isAdmin
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
        ? (user as Mentor).isAdmin
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

      const currentRole = mentor.isAdmin ? "admin" : "mentor";

      if (role !== currentRole) {
        await this.authRepo.setTokenCookie(
          studentId,
          currentRole,
          mentor.point,
        );
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isAdmin: _isAdmin, ...userData } = mentor;
      console.log(userData);
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
}
