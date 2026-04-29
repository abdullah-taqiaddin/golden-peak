"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
};

type HeaderNavProps = {
  links: readonly NavLink[];
};

export function HeaderNav({ links }: HeaderNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  function onTabClick(event: React.MouseEvent<HTMLAnchorElement>, href: string) {
    const hashIndex = href.indexOf("#");
    const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : "";
    const targetId = hash.trim();

    if (!targetId) return;

    if (pathname !== "/") {
      event.preventDefault();
      router.push(`/#${targetId}`);
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    const headerOffset = 96;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
    window.history.replaceState(null, "", `/#${targetId}`);
  }

  return (
    <nav className="hidden gap-6 md:flex">
      {links.map((link) => (
        <Link
          key={link.href}
          className="text-xs font-semibold tracking-wider text-slate-300 transition-colors hover:text-brand-amber"
          href={link.href}
          onClick={(event) => onTabClick(event, link.href)}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
