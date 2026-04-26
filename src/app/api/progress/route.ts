import { NextRequest, NextResponse } from "next/server";

import { requireApiUser } from "@/lib/api-auth";
import {
  getUserById,
  isFirebaseStoreError,
  listUserProgress,
  upsertUserProgress
} from "@/lib/firebase-store";
import { progressCreateSchema } from "@/lib/validators";

type ProgressItem = {
  entryDate: string;
  revenue: number;
};

function normalizeProgress(progress: unknown): ProgressItem[] {
  if (!Array.isArray(progress)) {
    return [];
  }

  return progress
    .map((row) => {
      const entryDate = String((row as Record<string, unknown>).entryDate ?? "");
      const revenue = Number((row as Record<string, unknown>).revenue ?? 0);

      return {
        entryDate,
        revenue
      };
    })
    .filter((row) => Boolean(row.entryDate));
}

export async function GET(request: NextRequest) {
  const { session, error } = await requireApiUser(request);
  if (error || !session) return error;

  try {
    const user = await getUserById(session.userId);
    if (!user || user.status !== "APPROVED") {
      return NextResponse.json({ error: "غير مصرح بالوصول." }, { status: 403 });
    }

    const progress = await listUserProgress(session.userId);

    return NextResponse.json({ progress: normalizeProgress(progress) });
  } catch (fetchError) {
    if (isFirebaseStoreError(fetchError)) {
      return NextResponse.json({ error: fetchError.message }, { status: fetchError.status });
    }

    return NextResponse.json({ error: "تعذر تحميل سجل المتابعة." }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireApiUser(request);
  if (error || !session) return error;

  try {
    const body = await request.json();
    const payload = progressCreateSchema.parse(body);
    const user = await getUserById(session.userId);
    if (!user || user.status !== "APPROVED") {
      return NextResponse.json({ error: "غير مصرح بالوصول." }, { status: 403 });
    }

    const progress = await upsertUserProgress(session.userId, {
      entryDate: payload.entryDate,
      revenue: payload.revenue
    });

    return NextResponse.json({
      message: "تم تحديث المتابعة.",
      progress: normalizeProgress(progress)
    });
  } catch (submitError) {
    if (submitError instanceof Error && submitError.name === "ZodError") {
      return NextResponse.json({ error: "بيانات المتابعة غير صالحة." }, { status: 400 });
    }

    if (isFirebaseStoreError(submitError)) {
      return NextResponse.json({ error: submitError.message }, { status: submitError.status });
    }

    return NextResponse.json({ error: "تعذر تحديث المتابعة حالياً." }, { status: 503 });
  }
}
