import Link from "next/link";

import { getServerSession } from "@/lib/auth";
import { HeaderNav } from "@/components/HeaderNav";
import { HeaderLogoutButton } from "@/components/HeaderLogoutButton";

const navLinks = [
  { href: "/#academy", label: "لماذا نحن" },
  { href: "/#analysis", label: "المسار التعليمي" },
  { href: "/#mentorship", label: "الإرشاد" },
  { href: "/#signals", label: "الذهب المباشر" },
  { href: "/#about", label: "الانضمام" }
] as const;

export async function Header() {
  const session = await getServerSession();

  return (
    <header
      dir="rtl"
      className="fixed inset-x-0 top-0 z-50 border-b border-brand-silver/20 bg-brand-navy/85 shadow-2xl backdrop-blur-xl"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-8 lg:px-12">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-white">
            GOLDEN PEAK
          </Link>
          <HeaderNav links={navLinks} />
        </div>

        {session?.role === "ADMIN" ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              className="text-xs font-semibold tracking-wider text-slate-200 transition-colors hover:text-brand-amber sm:text-sm"
              href="/staff-portal"
            >
              لوحة الإدارة
            </Link>
            <HeaderLogoutButton
              className="rounded-full border border-brand-silver/35 bg-brand-navy px-4 py-2 text-xs font-bold tracking-wider text-slate-100 transition-colors hover:border-brand-gold hover:text-brand-gold sm:px-6 sm:text-sm"
            />
          </div>
        ) : session?.role === "USER" ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              className="text-xs font-semibold tracking-wider text-slate-200 transition-colors hover:text-brand-amber sm:text-sm"
              href="/dashboard"
            >
              لوحتي
            </Link>
            <HeaderLogoutButton
              className="rounded-full border border-brand-silver/35 bg-brand-navy px-4 py-2 text-xs font-bold tracking-wider text-slate-100 transition-colors hover:border-brand-gold hover:text-brand-gold sm:px-6 sm:text-sm"
            />
          </div>
        ) : (
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
        )}
      </div>
    </header>
  );
}
