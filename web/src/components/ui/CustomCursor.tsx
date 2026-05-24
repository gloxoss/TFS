"use client";

import { useEffect } from "react";

/**
 * Simple cursor switcher — no custom visuals, just ensures
 * interactive elements show the correct native cursor style.
 * Kept as a component so it can be toggled on/off from layout.
 */
export default function CustomCursor() {
  useEffect(() => {
    // Skip on touch devices
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const isLink =
        target.tagName.toLowerCase() === "a" || !!target.closest("a");
      const isButton =
        target.tagName.toLowerCase() === "button" || !!target.closest("button");
      const isInput =
        target.tagName.toLowerCase() === "input" ||
        target.tagName.toLowerCase() === "textarea" ||
        target.tagName.toLowerCase() === "select";
      const hasRole =
        target.getAttribute("role") === "button" ||
        target.getAttribute("role") === "link";

      if (isLink || isButton || hasRole) {
        document.body.style.cursor = "pointer";
      } else if (isInput) {
        document.body.style.cursor = "text";
      } else {
        document.body.style.cursor = "default";
      }
    };

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = "";
    };
  }, []);

  // No visual render — this component only manages cursor styles
  return null;
}
