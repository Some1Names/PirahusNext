import { NextRequest } from "next/server";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { requireAuth } from "@/src/lib/get-current-user";
import { updateProfileSchema } from "@/src/core/schema/profile";
import { AuthService } from "@/src/services/auth.service";

const authService = new AuthService();

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth(["admin", "mentor", "mentee"]);
    const body = await req.json();
    const { nickname } = updateProfileSchema.parse(body);
    const result = await authService.updateNickname(session.studentId, session.role, nickname);
    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}
