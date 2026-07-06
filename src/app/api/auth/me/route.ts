import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { getCurrentUser } from "@/src/lib/get-current-user";
import { AuthService } from "@/src/services/auth.service";

const authService = new AuthService();

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tokenPayload = await getCurrentUser();
    const result = await authService.me(tokenPayload);
    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
