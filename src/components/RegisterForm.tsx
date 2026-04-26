"use client";

import { FormEvent, useState } from "react";

import { EXPERIENCE_LEVEL_LABELS, ExperienceLevelValue } from "@/lib/experience-level";

export function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevelValue>("BEGINNER");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inlineMessage, setInlineMessage] = useState<string | null>(null);
  const [inlineError, setInlineError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setInlineError(null);
    setInlineMessage(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          experienceLevel
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setInlineError(result.error ?? "فشل إرسال طلب التسجيل.");
        return;
      }

      setInlineMessage(result.message ?? "تم إرسال طلب التسجيل.");
      setSubmitted(true);
      setFirstName("");
      setLastName("");
      setEmail("");
      setExperienceLevel("BEGINNER");
    } catch {
      setInlineError("حدث خطأ غير متوقع في الشبكة.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="panel w-full max-w-xl space-y-4 p-5" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold text-brand-amber">التسجيل بانتظار الموافقة</h1>
      <p className="text-sm text-slate-300">
        أدخل بياناتك. ستقوم الإدارة بمراجعة الطلب وتفعيل الحساب.
      </p>

      {inlineError && (
        <div className="rounded-md border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-200">
          {inlineError}
        </div>
      )}

      {submitted ? (
        <div className="rounded-md border border-brand-gold/70 bg-brand-gold/15 px-4 py-3 text-sm text-brand-amber">
          {inlineMessage ?? "تم إرسال الطلب بانتظار موافقة الإدارة."}
        </div>
      ) : (
        <>
          <label className="block space-y-1">
            <span className="text-sm text-slate-300">الاسم الأول</span>
            <input
              className="input"
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm text-slate-300">اسم العائلة</span>
            <input
              className="input"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </label>

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
            <span className="text-sm text-slate-300">مستوى الخبرة</span>
            <select
              className="input"
              name="experienceLevel"
              value={experienceLevel}
              onChange={(event) => setExperienceLevel(event.target.value as ExperienceLevelValue)}
              required
            >
              {Object.entries(EXPERIENCE_LEVEL_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <button className="button-primary w-full" disabled={submitting} type="submit">
            {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
          </button>
        </>
      )}
    </form>
  );
}
