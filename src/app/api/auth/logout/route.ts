import { cookies } from "next/headers";
import { successResponse } from "@/src/lib/api-response";

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");

  return successResponse(null);
}
