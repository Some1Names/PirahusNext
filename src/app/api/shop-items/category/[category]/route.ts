import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const { category } = await params;
    
    const items = await prisma.shopItem.findMany({
      where: { category },
      orderBy: { createdAt: "asc" },
    });
    
    return successResponse(items);
  } catch (error) {
    return handleError(error);
  }
}
