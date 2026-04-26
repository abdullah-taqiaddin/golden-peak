import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/api-auth";
import { isFirebaseStoreError, rejectUser } from "@/lib/firebase-store";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireApiAdmin(request);
  if (error) return error;
  const { id } = await params;

  try {
    await rejectUser(id);
    return NextResponse.json({ message: "تم رفض المستخدم." }, { status: 200 });
  } catch (rejectError) {
    if (isFirebaseStoreError(rejectError)) {
      return NextResponse.json({ error: rejectError.message }, { status: rejectError.status });
    }

    return NextResponse.json({ error: "فشل رفض المستخدم." }, { status: 503 });
  }
}
