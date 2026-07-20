import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import rateLimit from "@/src/lib/rate-limit";

const globalLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

const authLimiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export default async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    try {
      const forwardedFor = request.headers.get("x-forwarded-for");
      const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

      const pathname = request.nextUrl.pathname;
      if (
        pathname === "/api/auth/login" ||
        pathname === "/api/auth/password" ||
        pathname === "/api/auth/setupprofile"
      ) {
        await authLimiter.check(5, ip);
      } else {
        await globalLimiter.check(100, ip);
      }

      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { error: "Too Many Requests" },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
