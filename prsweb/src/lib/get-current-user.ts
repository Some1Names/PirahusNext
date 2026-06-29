import { cookies } from "next/headers";
import { verifyToken, TokenPayload } from "./jwt";
import { UnauthorizedError, ForbiddenError } from "../core/error/error";

export async function getCurrentUser(): Promise<TokenPayload> {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    throw new UnauthorizedError();
  }

  return verifyToken(token);
}

export async function requireAuth(allowedRoles: Array<"admin" | "mentor" | "mentee">): Promise<TokenPayload> {
  const session = await getCurrentUser();
  if (!allowedRoles.includes(session.role)) {
    throw new ForbiddenError("You do not have permission to perform this action");
  }
  return session;
}
