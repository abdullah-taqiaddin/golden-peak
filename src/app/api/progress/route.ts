import { NextRequest, NextResponse } from "next/server";

import { requireApiUser } from "@/lib/api-auth";
import { formatProgressRows, toDateOnly } from "@/lib/progress";
import { prisma } from "@/lib/prisma";
import { progressCreateSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const { session, error } = await requireApiUser(request);
  if (error || !session) return error;

  const rows = await prisma.progressEntry.findMany({
    where: { userId: session.userId },
    orderBy: { entryDate: "asc" }
  });

  return NextResponse.json({ progress: formatProgressRows(rows) });
}

export async function POST(request: NextRequest) {
  const { session, error } = await requireApiUser(request);
  if (error || !session) return error;

  try {
    const body = await request.json();
    const payload = progressCreateSchema.parse(body);
    const entryDate = toDateOnly(payload.entryDate);

    await prisma.progressEntry.upsert({
      where: {
        userId_entryDate: {
          userId: session.userId,
          entryDate
        }
      },
      update: {
        revenue: payload.revenue
      },
      create: {
        userId: session.userId,
        entryDate,
        revenue: payload.revenue
      }
    });

    const rows = await prisma.progressEntry.findMany({
      where: { userId: session.userId },
      orderBy: { entryDate: "asc" }
    });

    return NextResponse.json({ message: "تم تحديث المتابعة.", progress: formatProgressRows(rows) });
  } catch {
    return NextResponse.json({ error: "بيانات المتابعة غير صالحة." }, { status: 400 });
  }
}
