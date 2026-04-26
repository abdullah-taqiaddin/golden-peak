import { NextRequest, NextResponse } from "next/server";

import { requireApiAdmin } from "@/lib/api-auth";
import { generateRandomPassword } from "@/lib/credentials";
import { approveUser, isFirebaseStoreError } from "@/lib/firebase-store";
import { sendApprovalEmail } from "@/lib/mailer";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireApiAdmin(request);
  if (error) return error;
  const { id } = await params;

  const password = generateRandomPassword(8);

  let updated: { id: string; email: string; firstName: string };

  try {
    updated = await approveUser(id, password);
  } catch (approveError) {
    if (isFirebaseStoreError(approveError)) {
      return NextResponse.json({ error: approveError.message }, { status: approveError.status });
    }

    return NextResponse.json({ error: "فشل اعتماد المستخدم." }, { status: 503 });
  }

  if (!updated?.email) {
    return NextResponse.json(
      { error: "تعذر قراءة بيانات المستخدم بعد الاعتماد." },
      { status: 502 }
    );
  }

  const emailSent = await sendApprovalEmail({
    to: updated.email,
    firstName: updated.firstName || "Trader",
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
