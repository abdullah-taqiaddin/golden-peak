import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import {
  checkAdminLoginBlocked,
  clearAdminLoginFailures,
  getAdminLoginRateLimitKey,
  recordAdminLoginFailure
} from "@/lib/rate-limit";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import { adminLoginSchema } from "@/lib/validators";

function getClientIpAddress(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return "unknown";
}

export async function POST(request: NextRequest) {
  const ipAddress = getClientIpAddress(request);
  const rateLimitKey = getAdminLoginRateLimitKey(ipAddress);
  const blocked = checkAdminLoginBlocked(rateLimitKey);

  if (blocked.blocked) {
    return NextResponse.json(
      { error: "بيانات الدخول غير صحيحة." },
      {
        status: 429,
        headers: {
          "Retry-After": String(blocked.retryAfterSeconds)
        }
      }
    );
  }

  try {
    const body = await request.json();
    const payload = adminLoginSchema.parse(body);

    const emailOk = payload.email.toLowerCase() === env.ADMIN_EMAIL.toLowerCase();
    const passwordOk = payload.password === env.ADMIN_PASSWORD;

    if (!emailOk || !passwordOk) {
      const failure = recordAdminLoginFailure(rateLimitKey);
      const statusCode = failure.blocked ? 429 : 401;

      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة." },
        {
          status: statusCode,
          headers: failure.blocked
            ? {
                "Retry-After": String(failure.retryAfterSeconds)
              }
            : undefined
        }
      );
    }

    clearAdminLoginFailures(rateLimitKey);

    const token = await createSessionToken({
      userId: "admin",
      role: "ADMIN",
      email: payload.email
    });

    const response = NextResponse.json({ message: "تم تسجيل دخول الإدارة بنجاح." });
    setSessionCookie(response, token);

    return response;
  } catch {
    return NextResponse.json({ error: "بيانات الدخول غير صحيحة." }, { status: 400 });
  }
}
