import { NextRequest } from "next/server";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { requireAuth } from "@/src/lib/get-current-user";
import { AuthService } from "@/src/services/auth.service";
import { deletePasswordSchema } from "@/src/core/schema/auth";

const authService = new AuthService();

export async function DELETE(req: NextRequest) {
  try {
    await requireAuth(["admin"]);
    const body = await req.json();
    const { id, role } = deletePasswordSchema.parse(body);

    await authService.deletePassword(id, role);

    return successResponse({ success: true });
  } catch (error) {
    return handleError(error);
  }
}
