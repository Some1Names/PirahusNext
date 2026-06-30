import { prisma } from "@/src/lib/prisma";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { NextRequest } from "next/server";
import { requireAuth } from "@/src/lib/get-current-user";
import { CreateAdmissionYearSchema, UpdateAdmissionYearSchema } from "@/src/core/schema/admission-year";

export async function GET() {
  try {
    await requireAuth(["admin", "mentor", "mentee"]);
    const setting = await prisma.admissionYear.findFirst();

    return successResponse(setting);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(["admin"]);
    const body = await req.json();
    const validatedData = CreateAdmissionYearSchema.parse(body);

    const { mentorYear, menteeYear } = validatedData;

    const existing = await prisma.admissionYear.findFirst();

    if (existing) {
      return handleError({
        status: 409,
        message: "Setting already exists",
      });
    }

    const setting = await prisma.admissionYear.create({
      data: {
        mentorYear,
        menteeYear,
      },
    });

    return successResponse(setting, 201);
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAuth(["admin"]);
    const body = await req.json();
    const validatedData = UpdateAdmissionYearSchema.parse(body);

    const { mentorYear, menteeYear } = validatedData;

    const setting = await prisma.admissionYear.findFirst();

    if (!setting) {
      return handleError({
        status: 404,
        message: "Setting not found",
      });
    }

    const updated = await prisma.admissionYear.update({
      where: {
        id: setting.id,
      },
      data: {
        ...(mentorYear && { mentorYear }),
        ...(menteeYear && { menteeYear }),
      },
    });

    return successResponse(updated);
  } catch (error) {
    return handleError(error);
  }
}
