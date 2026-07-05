"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import {
  BankIcon,
  BotIcon,
  CalendarIcon,
  CardIcon,
  ChartIcon,
  GearIcon,
  GridIcon,
  MessageIcon,
  PenIcon,
  TargetIcon,
} from "@/components/icons";
import { AuthError, getMe } from "@/lib/api";
import {
  clearSession,
  getToken,
  getUser,
  isPaidPlan,
  updateStoredPlan,
} from "@/lib/auth";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const nav: { href: string; label: string; icon: Icon }[] = [
  { href: "/dashboard", label: "Overview", icon: GridIcon },
  { href: "/dashboard/agents", label: "Agents", icon: BotIcon },
  { href: "/dashboard/conversations", label: "Conversations", icon: MessageIcon },
  { href: "/dashboard/leads", label: "Leads", icon: TargetIcon },
  { href: "/dashboard/bookings", label: "Bookings", icon: CalendarIcon },
  { href: "/dashboard/content", label: "Content", icon: PenIcon },
  { href: "/dashboard/financing", label: "Financing", icon: BankIcon },
  { href: "/dashboard/analytics", label: "Analytics", icon: ChartIcon },
  { href: "/dashboard/billing", label: "Billing", icon: CardIcon },
  { href: "/dashboard/settings", label: "Settings", icon: GearIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    // Verify the live plan: only paid users get in; the rest hit the paywall.
    getMe(token)
      .then((profile) => {
        updateStoredPlan(profile.plan);
        setEmail(profile.email);
        if (!isPaidPlan(profile.plan)) {
          router.replace("/choose-plan");
          return;
        }
        setReady(true);
      })
      .catch((e) => {
        if (e instanceof AuthError) {
          clearSession();
          router.replace("/login");
          return;
        }
        // Backend unreachable — fall back to the stored plan.
        const user = getUser();
        if (!isPaidPlan(user?.plan)) {
          router.replace("/choose-plan");
          return;
        }
        setEmail(user?.email ?? null);
        setReady(true);
      });
  }, [router]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function signOut() {
    router.push("/logout");
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
      </div>
    );
  }

  const initials = email?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="flex min-h-screen bg-bg-soft/40">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          aria-hidden
        />
      )}

      {/* Sidebar — fixed drawer on mobile, sticky column on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border bg-bg px-3 py-5 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="text-lg font-semibold tracking-tight">
              EnsightLabs
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-fg lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto">
          {nav.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-brand/10 font-medium text-brand"
                    : "text-muted hover:bg-surface hover:text-fg"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />
                )}
                <Icon
                  className={`h-[18px] w-[18px] transition-transform group-hover:scale-110 ${
                    active ? "text-brand" : ""
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border pt-3">
          <div className="flex items-center gap-2 px-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/15 text-sm font-semibold text-brand">
              {initials}
            </span>
            {email && (
              <p className="min-w-0 flex-1 truncate text-xs text-muted" title={email}>
                {email}
              </p>
            )}
          </div>
          <button
            onClick={signOut}
            className="mt-2 w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface hover:text-fg"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-fg hover:bg-surface"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-semibold tracking-tight">EnsightLabs</span>
          </Link>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
          {/* Re-mount on route change so content animates in each navigation. */}
          <div key={pathname} className="mx-auto max-w-4xl animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
