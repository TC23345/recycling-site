"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { GuideDefinition } from "@/lib/manifest";

interface MobileMenuProps {
  guides: GuideDefinition[];
  /** Server-rendered price badge nodes (one per metal). */
  priceBadges: ReactNode;
}

/**
 * Hamburger trigger + slide-in dialog panel for mobile (<md) viewports.
 *
 * Hidden at `md:` and above — desktop nav handles those breakpoints separately.
 * The panel renders pre-resolved server components (PriceBadges) passed via
 * `priceBadges` so we don't need to bridge the server/client boundary inside.
 */
export default function MobileMenu({ guides, priceBadges }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headingId = useId();
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  // Portal target requires document.body, which is only available client-side.
  useEffect(() => setMounted(true), []);

  // Escape closes; body scroll lock; focus management
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      // Simple focus trap inside the panel
      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the panel
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(t);
    };
  }, [open, close]);

  // When closing, restore focus to the trigger
  useEffect(() => {
    if (!open) {
      // Defer so we don't fight the open->close transition
      const t = window.setTimeout(() => triggerRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // The backdrop and panel must escape the <header>'s containing block:
  // header has `backdrop-blur-md`, which creates a new containing block and
  // would otherwise scope `position: fixed` to the header (~64px tall) instead
  // of the viewport. Portal to document.body to fix the dialog to the viewport.
  const overlay = (
    <>
      {/* Backdrop */}
      <div
        onClick={close}
        aria-hidden
        className={`fixed inset-0 z-50 bg-steel-950/40 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-[88%] max-w-sm flex-col overflow-y-auto border-l border-steel-200 bg-steel-50 shadow-steel transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "pointer-events-none translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-steel-200 px-5 py-4">
          <h2
            id={headingId}
            className="font-display text-base font-semibold text-navy-900"
          >
            Menu
          </h2>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-steel-200 bg-white text-steel-700 transition hover:border-rust-300 hover:text-rust-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 dark:bg-steel-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-6 px-5 py-5">
          <section aria-label="Live prices">
            <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-widest text-steel-500">
              Live prices
            </h3>
            <div className="grid grid-cols-2 gap-2">{priceBadges}</div>
          </section>

          <section aria-label="Guides">
            <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-widest text-steel-500">
              Guides
            </h3>
            <ul className="flex flex-col gap-1">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={g.href}
                    onClick={close}
                    className="block rounded-md bg-white px-4 py-3 text-sm transition hover:bg-steel-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 dark:bg-steel-100 dark:hover:bg-steel-200"
                  >
                    <span className="block font-display font-semibold text-navy-900">
                      {g.shortTitle}
                    </span>
                    <span className="mt-0.5 block text-xs text-steel-500">
                      {g.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-label="Site">
            <h3 className="mb-2 font-display text-xs font-semibold uppercase tracking-widest text-steel-500">
              Site
            </h3>
            <ul className="flex flex-col gap-1">
              <li>
                <Link
                  href="/about"
                  onClick={close}
                  className="block rounded-md px-4 py-3 text-sm font-medium text-steel-700 transition hover:bg-steel-100 hover:text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  onClick={close}
                  className="block rounded-md px-4 py-3 text-sm font-medium text-steel-700 transition hover:bg-steel-100 hover:text-navy-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </>
  );

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Open menu"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-steel-200 bg-white text-steel-700 transition hover:border-rust-300 hover:text-rust-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rust-500 dark:bg-steel-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </svg>
      </button>
      {mounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}
