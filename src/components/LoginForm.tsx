"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password
        })
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error ?? "فشل تسجيل الدخول.");
        return;
      }

      toast.success("تم تسجيل الدخول بنجاح.");
      router.push("/users");
      router.refresh();
    } catch {
      toast.error("حدث خطأ غير متوقع في الشبكة.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="panel space-y-4 p-5" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-brand-amber">دخول المتداول</h1>
      <p className="text-sm text-slate-300">
        سجّل الدخول للوصول إلى لوحة المتابعة، تحديث النتائج، ومواصلة الدورة التدريبية.
      </p>

      <label className="block space-y-1">
        <span className="text-sm text-slate-300">البريد الإلكتروني</span>
        <input
          className="input"
          name="email"
          autoComplete="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm text-slate-300">كلمة المرور</span>
        <input
          className="input"
          name="password"
          autoComplete="current-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>

      <button className="button-primary w-full" disabled={submitting} type="submit">
        {submitting ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
