"use client";

import { useEffect } from "react";

export function ScrollbarVisibility() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const body = document.body;
    let timeoutId: number | null = null;

    const showScrollbar = () => {
      body.classList.add("body-scroll-visible");
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        body.classList.remove("body-scroll-visible");
      }, 800);
    };

    const handleScroll = () => {
      showScrollbar();
    };

    // Capture scroll events from any scrollable container
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll, true);
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return null;
}

