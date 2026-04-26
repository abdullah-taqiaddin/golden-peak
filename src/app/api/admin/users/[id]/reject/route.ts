import { UserStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireApiAdmin(request);
  if (error) return error;
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user || user.role !== "USER") {
    return NextResponse.json({ error: "المستخدم غير موجود." }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      status: UserStatus.REJECTED
    }
  });

  return NextResponse.json({ message: "تم رفض المستخدم." });
}
