"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "./logo";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#pricing", label: "Pricing" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/90 text-fg shadow-sm shadow-blue-950/5 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
          <span className="text-[17px] font-bold tracking-tight">EnsightLabs</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-border bg-bg-soft/80 p-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:bg-white hover:text-brand hover:shadow-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-muted transition-colors hover:text-brand sm:block"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-soft"
          >
            Get started
          </Link>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-fg transition-colors hover:bg-bg-soft md:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          id="mobile-navigation"
          className="animate-fade-in border-t border-border bg-white md:hidden"
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-muted transition-colors hover:bg-bg-soft hover:text-brand active:bg-bg-soft active:text-brand"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-bg-soft hover:text-brand sm:hidden"
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
