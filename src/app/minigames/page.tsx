import Lobby from "@/src/lib/game/lobby/Lobby";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function MinigamesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    redirect("/auth/login");
  }

  return <Lobby />;
}
