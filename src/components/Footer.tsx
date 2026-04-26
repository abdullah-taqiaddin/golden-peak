import Link from "next/link";

export function Footer() {
  return (
    <footer dir="rtl" className="border-t border-brand-silver/20 bg-brand-navy/95 py-8">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-5 px-8 md:flex-row">
        <div className="text-center md:text-right">
          <span className="mb-2 block text-lg font-bold text-white">Golden Peak</span>
          <p className="max-w-sm text-xs text-slate-400">
            © 2026 Golden Peak Academy. جميع الحقوق محفوظة. التداول ينطوي على مخاطر مالية.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-6">
          <Link
            className="text-xs text-slate-300 transition-colors hover:text-brand-emerald"
            href="/terms-and-conditions"
          >
            الشروط والأحكام
          </Link>
        </nav>
      </div>
    </footer>
  );
}
