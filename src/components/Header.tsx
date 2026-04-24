"use client";

import Link from "next/link";

const navLinks = [
  { href: "/#academy", label: "الأكاديمية" },
  { href: "/#analysis", label: "التحليل" },
  { href: "/#signals", label: "الإشارات" },
  { href: "/#mentorship", label: "الإرشاد" },
  { href: "/#about", label: "من نحن" }
];

export function Header() {
  return (
    <header
      dir="rtl"
      className="fixed inset-x-0 top-0 z-50 border-b border-brand-silver/20 bg-brand-navy/85 shadow-2xl backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-white">
            Golden Peak
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                className="text-xs font-semibold tracking-wider text-slate-300 transition-colors hover:text-brand-amber"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            className="text-xs font-semibold tracking-wider text-slate-200 transition-colors hover:text-brand-amber sm:text-sm"
            href="/login"
          >
            تسجيل الدخول
          </Link>
          <Link
            className="rounded-full bg-brand-emerald px-4 py-2 text-xs font-bold tracking-wider text-[#003919] transition-all hover:brightness-105 active:scale-95 sm:px-6 sm:text-sm"
            href="/register"
          >
            ابدأ التداول
          </Link>
        </div>
      </div>
    </header>
  );
}
