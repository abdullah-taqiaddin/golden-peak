import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  getUserByEmail,
  isFirebaseStoreError
} from "@/lib/firebase-store";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import { userLoginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = userLoginSchema.parse({
      email: body.email ?? body.username,
      password: body.password
    });

    const user = await getUserByEmail(payload.email.toLowerCase());

    if (!user?.id || !user?.email) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة." }, { status: 401 });
    }

    if (user.status !== "APPROVED") {
      return NextResponse.json({ error: "الحساب غير معتمد بعد." }, { status: 403 });
    }

    if (!user.passwordHash) {
      return NextResponse.json({ error: "الحساب غير مهيأ بكلمة مرور بعد." }, { status: 403 });
    }

    const passwordMatches = await bcrypt.compare(payload.password, user.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة." }, { status: 401 });
    }

    const token = await createSessionToken({
      userId: user.id,
      role: "USER",
      email: user.email,
      firstName: user.firstName,
      experienceLevel: user.experienceLevel
    });

    const response = NextResponse.json({ message: "تم تسجيل الدخول بنجاح." });
    setSessionCookie(response, token);

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "بيانات تسجيل الدخول غير صالحة." }, { status: 400 });
    }

    if (isFirebaseStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("فشل تسجيل دخول المستخدم.", error);
    return NextResponse.json(
      { error: "خدمة تسجيل الدخول غير متاحة حالياً. يرجى المحاولة لاحقاً." },
      { status: 503 }
    );
  }
}
