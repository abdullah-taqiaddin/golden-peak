"use client";

import { useEffect } from "react";

export function ScrollToTop() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    window.addEventListener("popstate", scrollToTop);
    window.addEventListener("hashchange", scrollToTop);
    scrollToTop();

    return () => {
      window.removeEventListener("popstate", scrollToTop);
      window.removeEventListener("hashchange", scrollToTop);
    };
  }, []);

  return null;
}
