import { errorResponse } from "./api-response";
import { AppError } from "../core/error/error";

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return errorResponse(error.message, error.status, error.statusCode);
  }

  console.error(error);

  return errorResponse("Internal Server Error", 500, "INTERNAL_SERVER_ERROR");
}
