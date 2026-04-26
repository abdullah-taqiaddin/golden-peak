import { UserStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { prisma } from "@/lib/prisma";
import { getApiSession } from "@/lib/auth";
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
      experienceLevel: body.experienceLevel ?? body.experience_level ?? "BEGINNER"
    });

    const existing = await prisma.user.findUnique({ where: { email: payload.email.toLowerCase() } });

    if (existing) {
      if (existing.status === UserStatus.PENDING) {
        return NextResponse.json({ message: "طلب التسجيل موجود بالفعل بانتظار موافقة الإدارة." });
      }

      if (existing.status === UserStatus.APPROVED) {
        return NextResponse.json(
          { error: "يوجد حساب معتمد بالفعل لهذا البريد الإلكتروني." },
          { status: 409 }
        );
      }

      await prisma.user.update({
        where: { id: existing.id },
        data: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          experienceLevel: payload.experienceLevel,
          status: UserStatus.PENDING
        }
      });

      return NextResponse.json({ message: "تمت إعادة إرسال طلب التسجيل بنجاح." });
    }

    await prisma.user.create({
      data: {
        email: payload.email.toLowerCase(),
        firstName: payload.firstName,
        lastName: payload.lastName,
        experienceLevel: payload.experienceLevel,
        status: UserStatus.PENDING
      }
    });

    return NextResponse.json({ message: "تم إرسال طلب التسجيل بانتظار موافقة الإدارة." }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "بيانات التسجيل غير صالحة." }, { status: 400 });
    }

    console.error("فشل التسجيل.", error);
    return NextResponse.json(
      { error: "خدمة التسجيل غير متاحة حالياً. يرجى المحاولة لاحقاً." },
      { status: 503 }
    );
  }
}
