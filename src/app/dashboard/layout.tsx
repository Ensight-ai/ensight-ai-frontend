"use client";

import { useEffect, useState, type ComponentType, type SVGProps } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import {
  BankIcon,
  BotIcon,
  CalendarIcon,
  ChartIcon,
  GearIcon,
  GridIcon,
  MessageIcon,
  PenIcon,
  TargetIcon,
} from "@/components/icons";
import { getToken, getUser } from "@/lib/auth";

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

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    setEmail(getUser()?.email ?? null);
    setReady(true);
  }, [router]);

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
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-bg px-3 py-5">
        <Link href="/" className="flex items-center gap-2 px-2">
          <Logo className="h-7 w-7" />
          <span className="text-lg font-semibold tracking-tight">ensightLabs</span>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
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

      <main className="flex-1 px-8 py-10">
        {/* Re-mount on route change so content animates in each navigation. */}
        <div key={pathname} className="mx-auto max-w-4xl animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
