import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/api-auth";
import {
  isFirebaseStoreError,
  listUsersForAdmin
} from "@/lib/firebase-store";
import type { StatusFilter } from "@/lib/firebase-store";

export async function GET(request: NextRequest) {
  const { error } = await requireApiAdmin(request);
  if (error) return error;

  const statusParam = request.nextUrl.searchParams.get("status")?.toLowerCase();

  const normalizedStatus =
    statusParam && ["pending", "approved", "rejected", "all"].includes(statusParam)
      ? statusParam
      : undefined;

  try {
    const data = await listUsersForAdmin((normalizedStatus ?? "all") as StatusFilter);
    return NextResponse.json(data, { status: 200 });
  } catch (fetchError) {
    if (isFirebaseStoreError(fetchError)) {
      return NextResponse.json({ error: fetchError.message }, { status: fetchError.status });
    }

    return NextResponse.json({ error: "فشل تحميل المستخدمين." }, { status: 503 });
  }
}
