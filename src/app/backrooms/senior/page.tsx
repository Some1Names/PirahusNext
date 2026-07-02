import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/src/lib/jwt";
import SeniorBackroomClient from "./SeniorBackroomClient";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  try {
    const payload = verifyToken(token);
    if (payload.role !== "mentor" && payload.role !== "admin") {
      redirect("/");
    }
  } catch (error) {
    console.error("Authentication check failed in Senior Backrooms:", error);
    redirect("/auth/login");
  }

  return <SeniorBackroomClient />;
}
