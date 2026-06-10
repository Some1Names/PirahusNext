import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { UnauthorizedError } from "../core/error/error";

export async function getCurrentUser() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    throw new UnauthorizedError();
  }

  return verifyToken(token);
}
