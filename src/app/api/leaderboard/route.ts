import { NextRequest } from "next/server";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { requireAuth } from "@/src/lib/get-current-user";
import { LeaderboardService } from "@/src/services/leaderboard.service";

const leaderboardService = new LeaderboardService();

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const data = await leaderboardService.getTopScores(limit);
    return successResponse(data);
  } catch (error) {
    return handleError(error);
  }
}
