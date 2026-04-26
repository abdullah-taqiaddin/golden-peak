"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type HeaderLogoutButtonProps = {
  className?: string;
  label?: string;
};

export function HeaderLogoutButton({
  className = "button-ghost",
  label = "تسجيل الخروج"
}: HeaderLogoutButtonProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function onLogout() {
    if (loggingOut) {
      return;
    }

    setLoggingOut(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <button type="button" className={className} onClick={() => void onLogout()} disabled={loggingOut}>
      {loggingOut ? "جاري تسجيل الخروج..." : label}
    </button>
  );
}
