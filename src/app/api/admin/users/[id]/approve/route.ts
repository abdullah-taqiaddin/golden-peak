import bcrypt from "bcryptjs";
import { UserStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/api-auth";
import { generateRandomPassword } from "@/lib/credentials";
import { sendApprovalEmail } from "@/lib/mailer";
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

  if (user.status === UserStatus.REJECTED) {
    return NextResponse.json({ error: "لا يمكن اعتماد مستخدم مرفوض مباشرة." }, { status: 409 });
  }

  const password = generateRandomPassword(8);
  const passwordHash = await bcrypt.hash(password, 10);

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      status: UserStatus.APPROVED,
      passwordHash
    }
  });

  const emailSent = await sendApprovalEmail({
    to: updated.email,
    firstName: updated.firstName,
    password
  });

  if (process.env.NODE_ENV !== "production") {
    console.info("Generated approval credentials", {
      email: updated.email,
      password
    });
  }

  return NextResponse.json({
    message: "تم اعتماد المستخدم.",
    emailSent,
    credentials: {
      email: updated.email,
      password
    }
  });
}
