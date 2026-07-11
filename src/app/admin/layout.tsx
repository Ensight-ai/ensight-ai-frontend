"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthError, checkAdminAccess } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { CardIcon, GridIcon, UsersIcon } from "@/components/icons";

const nav = [
  { href: "/admin", label: "Overview", icon: GridIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/payments", label: "Payments", icon: CardIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }
    checkAdminAccess()
      .then(() => setReady(true))
      .catch((e) => {
        // 401 -> not signed in; anything else (403) -> not an admin.
        router.replace(e instanceof AuthError ? "/login" : "/dashboard");
      });
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-soft/40">
      <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-border bg-bg px-3 py-5">
        <Link href="/" className="flex items-center gap-2 px-2">
          <Logo className="h-7 w-7" />
          <span className="text-lg font-semibold tracking-tight">EnsightLabs</span>
          <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-medium text-brand">
            Admin
          </span>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
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
                <Icon className="h-[18px] w-[18px] transition-transform group-hover:scale-110" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border pt-3">
          <Link
            href="/dashboard"
            className="block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-fg"
          >
            ← Back to dashboard
          </Link>
        </div>
      </aside>

      <main className="flex-1 px-5 py-8 sm:px-8">
        <div key={pathname} className="mx-auto max-w-4xl animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
