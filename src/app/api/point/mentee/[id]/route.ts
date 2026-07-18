import { NextRequest } from "next/server";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { requireAuth } from "@/src/lib/get-current-user";
import { setPointSchema } from "@/src/core/schema/point";
import { MenteeService } from "@/src/services/mentee.service";

const menteeService = new MenteeService();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(["admin", "mentor", "mentee"]);
    const { id } = await params;
    const point = await menteeService.getPoint(id);
    return successResponse(point);
  } catch (error) {
    return handleError(error);
  }
}


export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(["admin"]);
    const { id } = await params;
    const body = await req.json();
    const { point } = setPointSchema.parse(body);
    const newPoint = await menteeService.setPoint(id, point);
    return successResponse(newPoint);
  } catch (error) {
    return handleError(error);
  }
}
