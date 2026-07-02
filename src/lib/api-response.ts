import { NextResponse } from "next/server";
import { ApiResponse } from "@/src/infra/interface/response";

export function successResponse<T>(
  data: T,
  status = 200,
  statusCode = "SUCCESS",
) {
  const response: ApiResponse<T> = {
    data,
    status,
    statusCode,
  };

  return NextResponse.json(response, { status });
}

export function errorResponse(
  error: string,
  status = 500,
  statusCode = "INTERNAL_SERVER_ERROR",
) {
  const response: ApiResponse<null> = {
    data: null,
    error,
    status,
    statusCode,
  };

  return NextResponse.json(response, { status });
}
