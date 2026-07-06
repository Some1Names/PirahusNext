import { NextRequest } from "next/server";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { requireAuth } from "@/src/lib/get-current-user";
import { MinigameRecordService } from "@/src/services/minigame-record.service";
import { submitMinigameRecordSchema } from "@/src/core/schema/minigame";

const recordService = new MinigameRecordService();

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth(["admin", "mentor", "mentee"]);
    const body = await req.json();
    const { gameName, timeTaken } = submitMinigameRecordSchema.parse(body);

    const record = await recordService.submitRecord(
      session.studentId,
      session.role,
      gameName,
      timeTaken,
    );

    return successResponse(record);
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    await requireAuth(["admin", "mentor", "mentee"]);
    const searchParams = req.nextUrl.searchParams;
    const gameName = searchParams.get("gameName");
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (!gameName) {
      throw new Error("gameName is required");
    }

    const data = await recordService.getLeaderboard(gameName, limit);
    return successResponse(data);
  } catch (error) {
    return handleError(error);
  }
}
