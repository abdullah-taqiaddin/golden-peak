import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { getApiSession } from "@/lib/auth";
import { createPendingUser, isFirebaseStoreError } from "@/lib/firebase-store";
import { registerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const session = await getApiSession(request);
    if (session?.role === "ADMIN") {
      return NextResponse.json(
        { error: "حساب الإدارة لا يمكنه إرسال طلب انضمام." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const payload = registerSchema.parse({
      firstName: body.firstName ?? body.first_name ?? body.firstname,
      lastName: body.lastName ?? body.last_name ?? body.lastname,
      email: body.email,
      phoneNumber: body.phoneNumber ?? body.phone_number ?? body.phone,
      experienceLevel: body.experienceLevel ?? body.experience_level ?? "BEGINNER"
    });

    await createPendingUser({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      experienceLevel: payload.experienceLevel
    });

    return NextResponse.json(
      { message: "تم إرسال طلب التسجيل بانتظار موافقة الإدارة." },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "بيانات التسجيل غير صالحة." }, { status: 400 });
    }

    if (isFirebaseStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("فشل التسجيل.", error);
    return NextResponse.json(
      { error: "خدمة التسجيل غير متاحة حالياً. يرجى المحاولة لاحقاً." },
      { status: 503 }
    );
  }
}
