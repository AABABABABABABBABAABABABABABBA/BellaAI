import { describe, expect, it } from "@jest/globals";

import {
  ORGANIZATION_JSON_LD,
  SOFTWARE_APPLICATION_JSON_LD,
  SITE_URL,
  WEBSITE_JSON_LD,
  canonicalMetadata,
  formatPublicPageDate,
} from "../site";
import { PRICING } from "@/lib/pricing/config";

describe("public site metadata", () => {
  it("builds self-referencing canonical paths against the site metadata base", () => {
    expect(SITE_URL).toBe("https://bellaai.snore.pw");
    expect(canonicalMetadata("/product")).toEqual({
      alternates: { canonical: "/product" },
    });
    expect(formatPublicPageDate("2026-09-01")).toBe("September 1, 2026");
  });

  it.each([
    ["/", "https://bellaai.snore.pw/?utm_source=chatgpt&utm_medium=referral"],
    ["/product", "https://bellaai.snore.pw/product?ref=assistant"],
    ["/pricing", "https://bellaai.snore.pw/pricing?trk=partner"],
    [
      "/download",
      "https://bellaai.snore.pw/download?snoball_referral=campaign#desktop",
    ],
  ] as const)(
    "keeps the %s canonical clean for parameterized entry URLs",
    (path, entryUrl) => {
      const canonical = canonicalMetadata(path).alternates?.canonical;

      expect(canonical).toBe(path);
      expect(new URL(String(canonical), entryUrl).href).toBe(
        `${SITE_URL}${path}`,
      );
    },
  );

  it("publishes supported organization and software application entities", () => {
    expect(ORGANIZATION_JSON_LD).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://bellaai.snore.pw/#organization",
      name: "BellaAI",
      url: "https://bellaai.snore.pw",
    });
    expect(WEBSITE_JSON_LD).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://bellaai.snore.pw/#website",
      name: "BellaAI",
      url: "https://bellaai.snore.pw",
      publisher: { "@id": "https://bellaai.snore.pw/#organization" },
    });
    expect(SOFTWARE_APPLICATION_JSON_LD).toMatchObject({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": "https://bellaai.snore.pw/product#software-application",
      name: "BellaAI",
      url: "https://bellaai.snore.pw/product",
      publisher: { "@id": "https://bellaai.snore.pw/#organization" },
    });
    const expectedOffers = [
      ["BellaAI Free", "0"],
      ["BellaAI Pro", String(PRICING.pro.monthly)],
      ["BellaAI Pro+", String(PRICING["pro-plus"].monthly)],
      ["BellaAI Ultra", String(PRICING.ultra.monthly)],
      ["BellaAI Team (per seat)", String(PRICING.team.monthly)],
    ];

    for (const [name, price] of expectedOffers) {
      expect(SOFTWARE_APPLICATION_JSON_LD.offers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            "@type": "Offer",
            name,
            price,
            priceCurrency: "USD",
          }),
        ]),
      );
    }
  });
});
