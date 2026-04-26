import { redirect } from "next/navigation";

import { getServerSession } from "@/lib/auth";
import { RegisterForm } from "@/components/RegisterForm";

export default async function RegisterPage() {
  const session = await getServerSession();

  if (session?.role === "ADMIN") {
    redirect("/staff-portal");
  }

  if (session?.role === "USER") {
    redirect("/dashboard");
  }

  return (
    <section className="mx-auto grid min-h-[calc(100dvh-14rem)] w-full max-w-6xl items-center gap-4 px-4 py-6 lg:grid-cols-[0.95fr_1fr]">
      <article className="panel hidden space-y-4 p-6 lg:block">
        <p className="text-xs tracking-[0.18em] text-brand-amber">طلب الانضمام</p>
        <h1 className="text-3xl font-semibold text-white">ابدأ رحلتك في التداول</h1>
        <p className="text-sm text-slate-300">
          أدخل بياناتك لطلب الوصول. بعد الموافقة، يتم إنشاء بيانات الدخول وإرسالها لك.
        </p>
        <ul className="space-y-2 text-sm text-slate-200">
          <li>مراجعة يدوية من الإدارة قبل التفعيل</li>
          <li>تصنيف مستوى الخبرة عند التسجيل</li>
          <li>وصول فوري لصفحات المتابعة والدورة بعد الموافقة</li>
        </ul>
      </article>
      <RegisterForm />
    </section>
  );
}
