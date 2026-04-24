import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="flex flex-row gap-3 align-center justify-center pt-20 w-full">
      <article className="panel hidden space-y-4 p-6 lg:block w-[20%]">
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
