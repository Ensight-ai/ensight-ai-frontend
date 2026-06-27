import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that govern your use of EnsightLabs.",
};

const EFFECTIVE_DATE = "June 27, 2026";

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. Agreement to these Terms",
    body: [
      "These Terms of Service (the “Terms”) govern your access to and use of EnsightLabs (the “Service”), operated by EnsightLabs (“we”, “us”, “our”). By creating an account or using the Service, you agree to these Terms. If you do not agree, do not use the Service.",
    ],
  },
  {
    heading: "2. Eligibility",
    body: [
      "You must be at least 18 years old, or the age of majority in your jurisdiction, and able to form a binding contract. If you use the Service on behalf of an organisation, you represent that you are authorised to bind that organisation to these Terms.",
    ],
  },
  {
    heading: "3. Your account",
    body: [
      "You are responsible for the activity under your account and for keeping your login credentials secure. You agree to provide accurate information and to notify us promptly of any unauthorised use. We may suspend or terminate accounts that violate these Terms.",
    ],
  },
  {
    heading: "4. Subscriptions, billing and cancellation",
    body: [
      "Paid plans (Starter, Beta, Pro) are billed monthly in advance through our payment processor, Paystack. Prices are shown in Nigerian Naira (₦); any US-dollar figures are approximate and for reference only.",
      "Subscriptions renew automatically each month until cancelled. You can cancel at any time; cancellation stops future renewals and takes effect at the end of the current billing period. Except where required by law, payments are non-refundable for partial periods. We may change plan prices or features on reasonable notice.",
    ],
  },
  {
    heading: "5. Acceptable use",
    body: [
      "You agree not to use the Service to: break any law; upload content you don’t have the rights to; infringe others’ intellectual property or privacy; transmit malware; attempt to disrupt, reverse-engineer, or gain unauthorised access to the Service; or deploy agents for spam, harassment, deception, or other harmful purposes. You are responsible for the content your agents are trained on and the way you deploy them.",
    ],
  },
  {
    heading: "6. Your content and data",
    body: [
      "You retain ownership of the documents and content you upload (“Your Content”). You grant us a limited licence to store, process, and use Your Content solely to provide the Service to you — including indexing it so your agents can answer questions.",
      "You are responsible for having the rights and any necessary consents for the content you upload and for the conversations your agents handle with your visitors. You must handle visitor personal data in line with applicable laws.",
    ],
  },
  {
    heading: "7. AI-generated output",
    body: [
      "The Service uses AI to generate answers, lead assessments, content drafts, and other output. AI can be wrong or incomplete. You are responsible for reviewing output before relying on or publishing it. AI output is not professional, legal, medical, or financial advice.",
    ],
  },
  {
    heading: "8. Financial-access features",
    body: [
      "Our financial-access tools provide an automated loan-readiness assessment and help prepare application materials based on your business activity and the information you supply. EnsightLabs is not a bank, lender, or financial adviser. We do not lend money, and an assessment is not an offer, approval, or guarantee of any loan, credit, or financing. Lending decisions are made solely by third-party lenders on their own terms.",
    ],
  },
  {
    heading: "9. Third-party services",
    body: [
      "The Service relies on third parties including Google (Calendar, Meet, and AI models), Paystack (payments), and Supabase (authentication and data). Your use of features that connect these services is also subject to their terms. We are not responsible for third-party services we do not control.",
    ],
  },
  {
    heading: "10. Intellectual property",
    body: [
      "The Service, including its software, design, and branding, is owned by EnsightLabs and protected by applicable laws. These Terms do not grant you any right to our trademarks or to copy or resell the Service.",
    ],
  },
  {
    heading: "11. Disclaimers",
    body: [
      "The Service is provided “as is” and “as available”, without warranties of any kind, whether express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, error-free, or that AI output will be accurate.",
    ],
  },
  {
    heading: "12. Limitation of liability",
    body: [
      "To the maximum extent permitted by law, EnsightLabs will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, revenue, data, or goodwill. Our total liability for any claim relating to the Service will not exceed the amount you paid us in the three months before the event giving rise to the claim.",
    ],
  },
  {
    heading: "13. Termination",
    body: [
      "You may stop using the Service and delete your account at any time. We may suspend or terminate your access if you breach these Terms or to protect the Service. On termination, your right to use the Service ends; sections that by their nature should survive will survive.",
    ],
  },
  {
    heading: "14. Changes to these Terms",
    body: [
      "We may update these Terms from time to time. If we make material changes, we will take reasonable steps to notify you. Continuing to use the Service after changes take effect means you accept the updated Terms.",
    ],
  },
  {
    heading: "15. Contact",
    body: [
      "Questions about these Terms? Reach us at hello@ensightlabs.xyz.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:py-20">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-muted">
            Effective date: {EFFECTIVE_DATE}
          </p>

          <div className="mt-10 space-y-9">
            {sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-lg font-semibold tracking-tight">
                  {s.heading}
                </h2>
                {s.body.map((p, i) => (
                  <p
                    key={i}
                    className="mt-2 text-sm leading-relaxed text-fg/85"
                  >
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
