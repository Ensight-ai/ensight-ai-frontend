import { CTA } from "@/components/cta";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { OutcomesShowcase } from "@/components/outcomes-showcase";
import { Pricing } from "@/components/pricing";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { VoiceShowcase } from "@/components/voice-showcase";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Features />
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
