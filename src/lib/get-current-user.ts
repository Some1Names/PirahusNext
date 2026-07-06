import { cookies } from "next/headers";
import { verifyToken, TokenPayload } from "./jwt";
import { UnauthorizedError, ForbiddenError } from "../core/error/error";
import { Role } from "@/src/core/domain/user";

export async function getCurrentUser(): Promise<TokenPayload> {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    throw new UnauthorizedError();
  }

  return verifyToken(token);
}

export async function requireAuth(allowedRoles: Array<Role>): Promise<TokenPayload> {
  const session = await getCurrentUser();
  if (!allowedRoles.includes(session.role)) {
    throw new ForbiddenError("You do not have permission to perform this action");
  }
  return session;
}
