import { NextRequest } from "next/server";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { MinigameRecordService } from "@/src/services/minigame-record.service";

const minigameService = new MinigameRecordService();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const data = await minigameService.getTopScores(limit);
    return successResponse(data);
  } catch (error) {
    return handleError(error);
  }
}
