import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/src/lib/jwt";
import JuniorBackroomClient from "./JuniorBackroomClient";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  try {
    const payload = verifyToken(token);
    if (payload.role !== "mentee" && payload.role !== "admin") {
      redirect("/");
    }
  } catch (error) {
    console.error("Authentication check failed in Junior Backrooms:", error);
    redirect("/auth/login");
  }

  return <JuniorBackroomClient />;
}