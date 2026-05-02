"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { EXPERIENCE_LEVEL_LABELS, ExperienceLevelValue } from "@/lib/experience-level";
import { PhoneNumberField } from "@/components/PhoneNumberField";

export function LandingLeadForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCountryCode, setPhoneCountryCode] = useState("+962");
  const [phoneLocalNumber, setPhoneLocalNumber] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevelValue>("BEGINNER");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phoneNumber: `${phoneCountryCode}${phoneLocalNumber}`,
          experienceLevel
        })
      });

      const result = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error ?? "تعذر إرسال الطلب حالياً.");
        return;
      }

      setSuccessMessage(result.message ?? "تم إرسال الطلب بنجاح.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneCountryCode("+962");
      setPhoneLocalNumber("");
      setExperienceLevel("BEGINNER");
      setAcceptedTerms(false);
    } catch {
      setErrorMessage("تعذر إرسال الطلب حالياً.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {errorMessage && (
        <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-3 text-xs text-red-100">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="rounded-lg border border-[#4ae183]/50 bg-[#4ae183]/10 px-4 py-3 text-xs text-[#a9f6c7]">
          {successMessage}
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs text-[#c5c6cd]">الاسم الأول</label>
        <input
          className="w-full rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3 text-white outline-none transition-all focus:border-[#e9c349] focus:ring-1 focus:ring-[#e9c349]"
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-xs text-[#c5c6cd]">اسم العائلة</label>
        <input
          className="w-full rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3 text-white outline-none transition-all focus:border-[#e9c349] focus:ring-1 focus:ring-[#e9c349]"
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-xs text-[#c5c6cd]">البريد الإلكتروني</label>
        <input
          className="w-full rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3 text-white outline-none transition-all focus:border-[#e9c349] focus:ring-1 focus:ring-[#e9c349]"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <PhoneNumberField
        countryCode={phoneCountryCode}
        localNumber={phoneLocalNumber}
        onCountryCodeChange={setPhoneCountryCode}
        onLocalNumberChange={setPhoneLocalNumber}
        selectClassName="w-full rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3 text-white outline-none transition-all focus:border-[#e9c349] focus:ring-1 focus:ring-[#e9c349]"
        inputClassName="w-full rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3 text-white outline-none transition-all focus:border-[#e9c349] focus:ring-1 focus:ring-[#e9c349]"
      />

      <div>
        <label className="mb-2 block text-xs text-[#c5c6cd]">مستوى الخبرة</label>
        <select
          className="w-full rounded-lg border border-white/10 bg-[#191c1e] px-4 py-3 text-white outline-none transition-all focus:border-[#e9c349] focus:ring-1 focus:ring-[#e9c349]"
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
      </div>

      <label className="flex items-start gap-2 rounded-lg border border-white/10 bg-[#191c1e] px-3 py-3 text-sm text-slate-200">
        <input
          className="mt-1 h-4 w-4 accent-[#e9c349]"
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          required
        />
        <span>
          أوافق على{" "}
          <Link
            className="font-semibold text-[#e9c349] hover:text-[#f2d168]"
            href="/terms-and-conditions"
            target="_blank"
          >
            الشروط والأحكام
          </Link>
        </span>
      </label>

      <button
        className="w-full rounded-lg bg-[#4ae183] py-4 text-sm font-bold text-[#003919] transition-all hover:shadow-[0_0_15px_rgba(74,225,131,0.3)] active:scale-95"
        type="submit"
        disabled={submitting}
      >
        {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
      </button>
    </form>
  );
}
