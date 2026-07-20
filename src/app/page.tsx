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
    <>
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
      </main>
      <SiteFooter />
    </>
  );
}
