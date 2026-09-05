import type { Metadata } from "next";
import { PRICING } from "@/lib/pricing/config";

export const SITE_NAME = "BellaAI";
export const SITE_URL = "https://bellaai.snore.pw";
export const SITE_DESCRIPTION =
  "BellaAI is an AI agent for penetration testing that helps security practitioners investigate targets, use terminal and browser tools, analyze findings, and prepare reports.";
export const SITE_LOGO_URL = `${SITE_URL}/icon-512x512.png`;
export const SITE_SCREENSHOT_URL = `${SITE_URL}/images/hackerai-workspace.png`;
export const GITHUB_URL =
  "https://github.com/AABABABABABABBABAABABABABABBA/BellaAI";

export const PUBLIC_PAGE_LAST_MODIFIED = {
  home: "2026-09-02",
  product: "2026-09-02",
  pricing: "2026-09-02",
  download: "2026-09-02",
  trust: "2026-09-02",
  privacy: "2026-08-31",
  terms: "2026-09-02",
} as const;

export function formatPublicPageDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function canonicalMetadata(
  path: `/${string}` | "/",
): Pick<Metadata, "alternates"> {
  return {
    alternates: {
      canonical: path,
    },
  };
}

export const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: "BellaAI LLC",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: SITE_LOGO_URL,
    width: 512,
    height: 512,
  },
  sameAs: [GITHUB_URL],
} as const;

export const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
} as const;

const PAID_PLAN_OFFERS = (
  [
    ["pro", "BellaAI Pro"],
    ["pro-plus", "BellaAI Pro+"],
    ["ultra", "BellaAI Ultra"],
    ["team", "BellaAI Team (per seat)"],
  ] as const
).map(([key, name]) => ({
  "@type": "Offer",
  name,
  price: String(PRICING[key].monthly),
  priceCurrency: "USD",
  url: `${SITE_URL}/pricing`,
  priceSpecification: {
    "@type": "UnitPriceSpecification",
    price: String(PRICING[key].monthly),
    priceCurrency: "USD",
    billingDuration: "P1M",
  },
}));

export const SOFTWARE_APPLICATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/product#software-application`,
  name: SITE_NAME,
  url: `${SITE_URL}/product`,
  description: SITE_DESCRIPTION,
  applicationCategory: "SecurityApplication",
  applicationSubCategory: "Penetration testing assistant",
  operatingSystem: "Web, macOS, Windows, Linux, iOS, Android",
  image: SITE_SCREENSHOT_URL,
  dateModified: PUBLIC_PAGE_LAST_MODIFIED.product,
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  offers: [
    {
      "@type": "Offer",
      name: "BellaAI Free",
      price: "0",
      priceCurrency: "USD",
      url: `${SITE_URL}/pricing`,
    },
    ...PAID_PLAN_OFFERS,
  ],
} as const;
