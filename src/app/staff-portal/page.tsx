import { redirect } from "next/navigation";

import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getServerSession } from "@/lib/auth";

export default async function StaffPortalPage() {
  const session = await getServerSession();

  if (session?.role === "USER") {
    redirect("/dashboard");
  }

  if (session?.role === "ADMIN") {
    return <AdminDashboard />;
  }

  return (
    <section className="mx-auto grid min-h-[calc(100dvh-14rem)] w-full max-w-6xl items-center gap-4 px-4 py-6 lg:grid-cols-[0.95fr_1fr] ">
      <article className="panel hidden space-y-4 p-6 lg:block">
        <p className="text-xs tracking-[0.18em] text-brand-amber">بوابة الإدارة</p>
        <h1 className="text-3xl font-semibold text-white">مراجعة طلبات التسجيل</h1>
        <p className="text-sm text-slate-300">
          دخول الإدارة يتيح الموافقة أو الرفض ومتابعة تقدم المتداولين.
        </p>
        <ul className="space-y-2 text-sm text-slate-200">
          <li>الموافقة على المستخدمين وإنشاء بيانات الدخول</li>
          <li>مراجعة سجل التقدم للمستخدمين المعتمدين</li>
          <li>إدارة حالات الحسابات</li>
        </ul>
      </article>
      <AdminLoginForm />
    </section>
  );
}
