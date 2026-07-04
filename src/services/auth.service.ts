import { AuthRepository } from "@/src/repositories/auth.repository";
import { NotFoundError, UnauthorizedError } from "@/src/core/error/error";
import { Mentor } from "@/prisma/generated/client";
import { Role, LoginResponse, SetupProfileResponse, CurrentUser } from "@/src/core/domain/auth";

const authRepo = new AuthRepository();

export class AuthService {
  async login(studentId: string, password?: string): Promise<LoginResponse> {
    const config = await authRepo.findAdmissionYear();
    if (!config) throw new Error("Admission year setting not configured");

    let user: Mentor | Awaited<ReturnType<typeof authRepo.findMenteeByStudentId>> | null = null;
    let userType: "mentor" | "mentee" = "mentor";

    if (studentId.startsWith(config.mentorYear)) {
      user = await authRepo.findMentorByStudentId(studentId);
      userType = "mentor";
      if (!user) throw new NotFoundError("Mentor not found");
    } else if (studentId.startsWith(config.menteeYear)) {
      user = await authRepo.findMenteeByStudentId(studentId);
      userType = "mentee";
      if (!user) throw new NotFoundError("Mentee not found");
    } else {
      throw new Error("Invalid Student ID format for mentors or mentees");
    }

    const isFirstLogin = user.password === null;

    if (isFirstLogin) {
      const role: Role =
        userType === "mentor"
          ? (user as Mentor).isAdmin ? "admin" : "mentor"
          : "mentee";
      await authRepo.setTokenCookie(studentId, role, user.point);
      return { studentId, firstLogin: true };
    }

    if (!password) {
      return { studentId, firstLogin: false, hasPassword: true };
    }

    const isValid = authRepo.comparePassword(password, user.password!);
    if (!isValid) throw new UnauthorizedError("Incorrect password");

    const role: Role =
      userType === "mentor"
        ? (user as Mentor).isAdmin ? "admin" : "mentor"
        : "mentee";
    await authRepo.setTokenCookie(studentId, role, user.point);
    return { studentId, firstLogin: false };
  }

  async me(tokenPayload: { studentId: string; role: Role }): Promise<CurrentUser> {
    const { studentId, role } = tokenPayload;

    if (role === "admin" || role === "mentor") {
      const mentor = await authRepo.findMentorForMe(studentId);
      if (!mentor) throw new NotFoundError("Mentor not found");

      const currentRole = mentor.isAdmin ? "admin" : "mentor";

      if (role !== currentRole) {
        await authRepo.setTokenCookie(studentId, currentRole, mentor.point);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isAdmin: _isAdmin, ...userData } = mentor;
      return { ...userData, mentee: mentor.mentee || null, role: currentRole };
    }

    const mentee = await authRepo.findMenteeForMe(studentId);
    if (!mentee) throw new NotFoundError("Mentee not found");

    const currentRole = "mentee" as const;
    if (role !== currentRole) {
      await authRepo.setTokenCookie(studentId, currentRole, mentee.point);
    }

    return { ...mentee, role: currentRole };
  }

  async setupProfile(studentId: string, role: Role, password: string, nickname: string): Promise<SetupProfileResponse> {
    const hashed = authRepo.hashPassword(password);

    if (role === "admin" || role === "mentor") {
      await authRepo.updateMentorPassword(studentId, hashed, nickname);
    } else {
      const lastThree = studentId.slice(-3);
      const formattedNickname = `${lastThree} ${nickname}`;
      await authRepo.updateMenteePassword(studentId, hashed, formattedNickname);
    }

    return { message: "Password setup successfully" };
  }
}
