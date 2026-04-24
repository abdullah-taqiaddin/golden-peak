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

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function pushState(...args) {
      originalPushState.apply(this, args);
      requestAnimationFrame(scrollToTop);
    };

    window.history.replaceState = function replaceState(...args) {
      originalReplaceState.apply(this, args);
      requestAnimationFrame(scrollToTop);
    };

    window.addEventListener("popstate", scrollToTop);
    window.addEventListener("hashchange", scrollToTop);
    scrollToTop();

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
      window.removeEventListener("popstate", scrollToTop);
      window.removeEventListener("hashchange", scrollToTop);
    };
  }, []);

  return null;
}
