// Canonical site identity, used for SEO metadata, sitemap and robots.
// Override the URL per environment with NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ensightlabs.xyz"
).replace(/\/$/, "");

export const SITE_NAME = "EnsightLabs";

export const SITE_DESCRIPTION =
  "EnsightLabs gives your business a custom AI agent that answers visitors, qualifies sales leads, books meetings, drafts your marketing content, and even helps you access financing — trained on your own content and embedded in minutes.";
