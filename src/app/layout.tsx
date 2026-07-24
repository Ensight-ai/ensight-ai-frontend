import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { Toaster } from "@/components/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const TITLE = "EnsightLabs — AI that answers, converts & grows your business";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · EnsightLabs",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "AI agent",
    "AI chatbot",
    "AI customer support",
    "lead generation",
    "AI lead qualification",
    "AI meeting booking",
    "AI content generation",
    "voice AI agent",
    "website chatbot",
    "small business financing",
    "EnsightLabs",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description:
      "One AI platform to answer visitors, capture leads, book meetings, create content, and unlock financing — trained on your content, live in minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "One AI platform to answer visitors, capture leads, book meetings, create content, and unlock financing.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        {children}
        <iframe id="ensight-widget-pk_LyMhessCTP5o36Z6CWw7zNKaD_p0Qvyj" src="https://www.ensightlabs.xyz/w/pk_LyMhessCTP5o36Z6CWw7zNKaD_p0Qvyj?color=%232563eb&name=Ensightlabs+assistant&position=bottom-right&capability=both&greeting=Hi%21%2C+this+is+ensight+labs+AI+assistant%2C+how+can+we+help+you+today+%3F%E2%98%BA%EF%B8%8F%E2%98%BA%EF%B8%8F" title="Ensightlabs assistant" style="position:fixed;bottom:0;right:0;width:min(420px,100vw);height:min(600px,100dvh);border:0;background:transparent;z-index:2147483647;transition:width .15s ease,height .15s ease" allow="microphone; clipboard-write"></iframe>
        <Toaster />
      </body>
    </html>
  );
}
