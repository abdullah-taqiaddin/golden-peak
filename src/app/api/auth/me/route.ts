import { NextRequest, NextResponse } from "next/server";

import { getApiSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getApiSession(request);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      role: session.role,
      email: session.email,
      firstName: session.firstName,
      experienceLevel: session.experienceLevel
    }
  });
}
