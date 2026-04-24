import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <section className="flex flex-row gap-3 align-center justify-center pt-20 ">
      <article className="panel hidden space-y-4 p-6 lg:block">
        <p className="text-xs tracking-[0.18em] text-brand-amber">دخول الأعضاء</p>
        <h1 className="text-3xl font-semibold text-white">تداول بمنهجية واضحة</h1>
        <p className="text-sm text-slate-300">
          ادخل إلى أدوات المتابعة، وعرض السوق، ومسار الدورة التدريبية من لوحة واحدة.
        </p>
        <ul className="space-y-2 text-sm text-slate-200">
          <li>مخططات الذهب والفضة لحظياً</li>
          <li>تسجيل الأداء اليومي وتحليل الاتجاه</li>
          <li>تنفيذ الدورة في مساحة عمل مركزة</li>
        </ul>
      </article>
      <LoginForm />
    </section>
  );
}
