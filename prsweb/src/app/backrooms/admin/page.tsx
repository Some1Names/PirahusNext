import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/src/lib/jwt";
import AdminBackroomClient from "./AdminBackroomClient";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/");
  }

  try {
    const payload = verifyToken(token);
    if (payload.role !== "admin") {
      redirect("/");
    }
  } catch (error) {
    console.error("Authentication check failed in Admin Backrooms:", error);
    redirect("/");
  }

  return <AdminBackroomClient />;
}
