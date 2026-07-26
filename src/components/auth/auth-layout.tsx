import Link from "next/link";
import { Logo } from "@/components/logo";
import { CheckIcon } from "@/components/icons";

const highlights = [
  "Custom chat & voice agents",
  "Trained on your own documents",
  "Embed on any site in minutes",
];

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="product-page grid min-h-screen bg-bg-soft/50 lg:grid-cols-[1.2fr_0.8fr]">
      {/* form side */}
      <div className="flex flex-col bg-bg px-5 py-8 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7" />
            <span className="text-[17px] font-bold tracking-tight">EnsightLabs</span>
        </Link>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[400px]">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">EnsightLabs workspace</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-muted">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>

      {/* brand side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand via-[#2563eb] to-[#1e3a8a] lg:block">
        <div className="bg-grid absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute right-[-6rem] top-[-6rem] h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-center px-16 text-white">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100">AI for ambitious businesses</p>
          <h2 className="max-w-md text-3xl font-semibold leading-tight">
            Put an AI agent that knows your business on your website.
          </h2>
          <ul className="mt-8 space-y-4">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-white/90">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
