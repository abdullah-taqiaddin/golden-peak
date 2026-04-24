import { NextRequest, NextResponse } from "next/server";

import { getApiSession } from "@/lib/auth";

export async function requireApiUser(request: NextRequest) {
  const session = await getApiSession(request);

  if (!session || session.role !== "USER") {
    return {
      session: null,
      error: NextResponse.json({ error: "غير مصرح بالوصول." }, { status: 401 })
    };
  }

  return { session, error: null };
}

export async function requireApiAdmin(request: NextRequest) {
  const session = await getApiSession(request);

  if (!session || session.role !== "ADMIN") {
    return {
      session: null,
      error: NextResponse.json({ error: "هذا الإجراء مخصص للإدارة فقط." }, { status: 403 })
    };
  }

  return { session, error: null };
}
