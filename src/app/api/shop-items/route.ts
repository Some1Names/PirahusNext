import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { createShopItemSchema } from "@/src/core/schema/shop-item";
import { requireAuth } from "@/src/lib/get-current-user";

export async function GET() {
  try {
    const items = await prisma.shopItem.findMany({
      orderBy: { createdAt: "asc" },
    });
    return successResponse(items);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(["admin"]);

    const body = await req.json();
    const data = createShopItemSchema.parse(body);

    const newItem = await prisma.shopItem.create({
      data,
    });

    return successResponse(newItem);
  } catch (error) {
    return handleError(error);
  }
}
