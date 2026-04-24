import bcrypt from "bcryptjs";
import { UserStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import { userLoginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = userLoginSchema.parse({
      email: body.email ?? body.username,
      password: body.password
    });

    const user = await prisma.user.findFirst({
      where: {
        email: payload.email.toLowerCase(),
        status: UserStatus.APPROVED
      }
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(payload.password, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." }, { status: 401 });
    }

    const token = await createSessionToken({
      userId: user.id,
      role: "USER",
      email: user.email
    });

    const response = NextResponse.json({ message: "تم تسجيل الدخول بنجاح." });
    setSessionCookie(response, token);

    return response;
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "بيانات تسجيل الدخول غير صالحة." }, { status: 400 });
    }

    console.error("فشل تسجيل دخول المستخدم.", error);
    return NextResponse.json(
      { error: "خدمة تسجيل الدخول غير متاحة حالياً. يرجى المحاولة لاحقاً." },
      { status: 503 }
    );
  }
}
