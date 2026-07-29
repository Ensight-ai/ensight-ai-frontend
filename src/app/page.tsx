import { CTA } from "@/components/cta";
import { Features } from "@/components/features";
import { FinancingShowcase } from "@/components/financing-showcase";
import { GrowthBand } from "@/components/growth-band";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { OutcomesShowcase } from "@/components/outcomes-showcase";
import { Pricing } from "@/components/pricing";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VoiceShowcase } from "@/components/voice-showcase";
import { GOOGLE_LIMITED_USE_STATEMENT } from "@/lib/google-compliance";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: SITE_DESCRIPTION,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "NGN",
        lowPrice: "8500",
        highPrice: "35000",
        offerCount: "3",
      },
    },
  ],
};

export default function Home() {
  return (
    <div className="marketing-page min-h-screen bg-bg text-fg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <GrowthBand />
        <Features />
        <FinancingShowcase />
        <VoiceShowcase />
        <OutcomesShowcase />
        <HowItWorks />
        <Pricing />
        <CTA />
        <section
          aria-labelledby="google-limited-use-heading"
          className="border-t border-border/60 bg-bg-soft/70"
        >
          <div className="mx-auto max-w-6xl px-5 py-8 text-center">
            <h2
              id="google-limited-use-heading"
              className="text-sm font-bold text-fg"
            >
              Google API Limited Use
            </h2>
            <p className="mx-auto mt-2 max-w-4xl text-sm leading-6 text-fg">
              <strong>{GOOGLE_LIMITED_USE_STATEMENT}</strong>
            </p>
            <a
              href="/privacy"
              className="mt-3 inline-flex text-sm font-semibold text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-soft"
            >
              Read our Privacy Policy
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
