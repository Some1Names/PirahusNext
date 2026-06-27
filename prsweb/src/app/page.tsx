import { cookies } from "next/headers";
import { verifyToken } from "../lib/jwt";
import HomeClient from "../components/HomeClient";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  let role: string | null = null;

  if (token) {
    try {
      const payload = verifyToken(token);
      role = payload.role;
    } catch (e) {
      console.error("Failed to verify token in Page Server Component:", e);
    }
  }

  return <HomeClient role={role} />;
}