import { NextRequest, NextResponse } from "next/server";
import { UserStatus } from "@prisma/client";

import { requireApiAdmin } from "@/lib/api-auth";
import { formatProgressRows } from "@/lib/progress";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireApiAdmin(request);
  if (error) return error;
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      status: true,
      progressItems: {
        orderBy: { entryDate: "asc" },
        select: {
          entryDate: true,
          revenue: true
        }
      }
    }
  });

  if (!user) {
    return NextResponse.json({ error: "المستخدم غير موجود." }, { status: 404 });
  }

  if (user.status !== UserStatus.APPROVED) {
    return NextResponse.json(
      { error: "المتابعة متاحة فقط للمستخدمين المعتمدين." },
      { status: 403 }
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      progress: formatProgressRows(user.progressItems)
    }
  });
}
