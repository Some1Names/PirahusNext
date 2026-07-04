import { NextRequest } from "next/server";
import { successResponse } from "@/src/lib/api-response";
import { handleError } from "@/src/lib/handle-error";
import { requireAuth } from "@/src/lib/get-current-user";
import {
  createMentorSchema,
  updateMentorSchema,
} from "@/src/core/schema/mentor";
import { MentorService } from "@/src/services/mentor.service";

const mentorService = new MentorService();

export async function GET() {
  try {
    await requireAuth(["admin", "mentor"]);
    const mentors = await mentorService.findAll();
    return successResponse(mentors);
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(["admin"]);
    const body = await req.json();
    const validatedData = createMentorSchema.parse(body);
    const mentor = await mentorService.createMentor(validatedData);
    return successResponse(mentor, 201, "CREATED");
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await requireAuth(["admin"]);
    const body = await req.json();
    const validatedData = updateMentorSchema.parse(body);
    const mentor = await mentorService.update(validatedData.id, {
      studentId: validatedData.studentId,
    });
    return successResponse(mentor);
  } catch (error) {
    return handleError(error);
  }
}
