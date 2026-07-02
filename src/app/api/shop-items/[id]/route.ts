import { NextRequest } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { updateShopItemSchema } from "@/src/core/schema/shop-item";
import { requireAuth } from "@/src/lib/get-current-user";
import { NotFoundError } from "@/src/core/error/error";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const item = await prisma.shopItem.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundError("ShopItem not found");
    }

    return successResponse(item);
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(["admin"]);

    const { id } = await params;
    const body = await req.json();
    const data = updateShopItemSchema.parse(body);

    const existing = await prisma.shopItem.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("ShopItem not found");
    }

    const updatedItem = await prisma.shopItem.update({
      where: { id },
      data,
    });

    return successResponse(updatedItem);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth(["admin"]);

    const { id } = await params;

    const existing = await prisma.shopItem.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundError("ShopItem not found");
    }

    await prisma.shopItem.delete({
      where: { id },
    });

    return successResponse(null);
  } catch (error) {
    return handleError(error);
  }
}
