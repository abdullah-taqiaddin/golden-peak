import Link from "next/link";
import type { Route } from "next";

const footerLinks: Array<{ href: Route; label: string }> = [
  { href: "/academy-message" as Route, label: "رسالة الأكاديمية" },
  { href: "/terms-and-conditions", label: "الشروط والأحكام" }
];

export function Footer() {
  return (
    <footer dir="rtl" className="border-t border-brand-silver/20 bg-brand-navy/95 py-8">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-5 px-8 md:flex-row">
        <div className="text-center md:text-right">
          <span className="mb-2 block text-lg font-bold text-white">Golden Peak</span>
          <p className="max-w-sm text-xs text-slate-400">
            © 2026 Golden Peak Academy. التداول ينطوي على مخاطر عالية قد تؤدي الى خسازة رأس المال يرجى الاستعلام قبل البدء.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              className="text-xs text-slate-300 transition-colors hover:text-brand-emerald"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
