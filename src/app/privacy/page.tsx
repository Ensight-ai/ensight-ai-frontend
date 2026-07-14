import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EnsightLabs collects, uses, and protects your data.",
};

const EFFECTIVE_DATE = "July 14, 2026";

const sections: { heading: string; body: string[] }[] = [
  {
    heading: "1. Introduction",
    body: [
      "This Privacy Policy explains how EnsightLabs (“we”, “us”, “our”) collects, uses, shares, and protects personal data when you use EnsightLabs (the “Service”) at ensightlabs.xyz. By using the Service, you agree to this policy. It should be read together with our Terms of Service.",
    ],
  },
  {
    heading: "2. Information we collect",
    body: [
      "Account information: your email address and password (passwords are handled by our authentication provider and never stored by us in plain text), and your plan.",
      "Content you provide: documents and text you upload to train your agents, and the configuration of your agents.",
      "Visitor & conversation data: when a visitor talks to an agent on your website, we process the conversation and any details the visitor provides (e.g. name, email, phone) so the agent can answer, qualify leads, and book meetings.",
      "Payment information: subscriptions are processed by Paystack. We receive confirmation and limited transaction details (e.g. amount, status, reference) but do not store your card details.",
      "Google account data: if you connect Google Calendar, we access your availability and create calendar/Meet events on your behalf, using the scopes you approve.",
      "Usage & technical data: basic analytics about how agents are used (visits, conversations, questions), and standard technical information such as timestamps.",
    ],
  },
  {
    heading: "3. How we use your information",
    body: [
      "To provide and operate the Service — run your agents, answer visitors, qualify leads, book meetings, generate content, and produce financial-readiness assessments.",
      "To process payments and manage your subscription.",
      "To send transactional emails (email verification, password resets, and notifications such as when an agent is created).",
      "To provide analytics and improve the Service.",
      "To maintain security, prevent abuse, and comply with legal obligations.",
    ],
  },
  {
    heading: "4. AI processing of your content",
    body: [
      "Your uploaded documents are split, indexed into a private vector store scoped to your agent, and used to generate grounded answers. Content is processed by Google Vertex AI (Gemini) to power chat, lead qualification, content generation, and financial-readiness assessments. Your content is used only to provide the Service to you and is not used to answer another business’s visitors.",
    ],
  },
  {
    heading: "5. Your role vs. our role for visitor data",
    body: [
      "For personal data that your agents collect from your website visitors, you are the data controller and EnsightLabs acts as a processor on your behalf — we process that data to provide the Service to you. You are responsible for having a lawful basis and appropriate notices/consents for the visitors you engage.",
    ],
  },
  {
    heading: "6. Third-party services (sub-processors)",
    body: [
      "We rely on trusted third parties to run the Service, and share data with them only as needed: Supabase (authentication and database), Google Cloud / Vertex AI (AI models and speech), Google Calendar (meeting booking), Paystack (payments), and ZeptoMail (transactional email). Each processes data under its own terms and security practices.",
    ],
  },
  {
    heading: "7. How we share information",
    body: [
      "We do not sell your personal data. We share it only: with the sub-processors above to operate the Service; when required by law or to respond to lawful requests; to protect the rights, safety, and security of EnsightLabs, our users, or the public; and in connection with a business transfer (e.g. merger or acquisition), subject to this policy.",
    ],
  },
  {
    heading: "8. Cookies & local storage",
    body: [
      "We use browser local storage to keep you signed in (session tokens) and to remember basic preferences. The embeddable widget stores a visitor identifier so returning visitors are recognised. We do not use third-party advertising cookies.",
    ],
  },
  {
    heading: "9. Data retention",
    body: [
      "We retain your account data, agent content, and conversation logs for as long as your account is active or as needed to provide the Service. You can delete agents and content from your dashboard; deleting your account removes associated data, subject to backups and any retention required by law (e.g. financial records).",
    ],
  },
  {
    heading: "10. Data security",
    body: [
      "We use reasonable technical and organisational measures to protect your data, including encrypted connections (HTTPS), scoped access to each tenant’s data, and secret keys kept server-side. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    heading: "11. Your rights",
    body: [
      "Depending on your location, you may have the right to access, correct, delete, export, or restrict the processing of your personal data, and to object to certain processing. You can exercise many of these directly in your dashboard, or by contacting us at hello@ensightlabs.xyz. If you are an EU/UK or Nigerian resident, additional rights under the GDPR / UK GDPR / Nigeria Data Protection Act may apply.",
    ],
  },
  {
    heading: "12. International data transfers",
    body: [
      "Our providers may process and store data in countries other than yours. Where required, we rely on appropriate safeguards for such transfers.",
    ],
  },
  {
    heading: "13. Children",
    body: [
      "The Service is not directed to children under 18, and we do not knowingly collect personal data from them. If you believe a child has provided us data, contact us and we will delete it.",
    ],
  },
  {
    heading: "14. Changes to this policy",
    body: [
      "We may update this Privacy Policy from time to time. If we make material changes, we will take reasonable steps to notify you. Continuing to use the Service after changes take effect means you accept the updated policy.",
    ],
  },
  {
    heading: "15. Contact",
    body: [
      "Questions about this policy or your data? Reach us at hello@ensightlabs.xyz.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-5 py-16 lg:py-20">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy Policy
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
