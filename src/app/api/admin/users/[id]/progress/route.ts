import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/api-auth";
import {
  getUserById,
  isFirebaseStoreError,
  listUserProgress
} from "@/lib/firebase-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireApiAdmin(request);
  if (error) return error;
  const { id } = await params;

  try {
    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "المستخدم غير موجود." }, { status: 404 });
    }

    const progress = await listUserProgress(id);
    return NextResponse.json({ user: { progress } }, { status: 200 });
  } catch (fetchError) {
    if (isFirebaseStoreError(fetchError)) {
      return NextResponse.json({ error: fetchError.message }, { status: fetchError.status });
    }

    return NextResponse.json({ error: "فشل تحميل سجل المتابعة." }, { status: 503 });
  }
}
