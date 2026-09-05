import type { SubscriptionTier } from "@/types";

/** All known paid entitlement slugs, grouped by tier (highest first). */
const TIER_ENTITLEMENTS: ReadonlyArray<{
  tier: SubscriptionTier;
  slugs: readonly string[];
}> = [
  {
    tier: "ultra",
    slugs: ["ultra-plan", "ultra-monthly-plan", "ultra-yearly-plan"],
  },
  { tier: "team", slugs: ["team-plan"] },
  {
    tier: "pro-plus",
    slugs: ["pro-plus-plan", "pro-plus-monthly-plan", "pro-plus-yearly-plan"],
  },
  {
    tier: "pro",
    slugs: ["pro-plan", "pro-monthly-plan", "pro-yearly-plan"],
  },
];

/**
 * Safely coerce a raw entitlements value (from a JWT or session) into a
 * typed string array.
 */
export function parseEntitlements(raw: unknown): string[] {
  return Array.isArray(raw)
    ? raw.filter((e: unknown): e is string => typeof e === "string")
    : [];
}

/**
 * Resolve the highest subscription tier present in an entitlements list.
 * Returns `"free"` when no paid entitlement matches.
 */
export function resolveSubscriptionTier(
  entitlements: readonly string[],
): SubscriptionTier {
  for (const { tier, slugs } of TIER_ENTITLEMENTS) {
    if (slugs.some((s) => entitlements.includes(s))) {
      return tier;
    }
  }
  return "free";
}

/**
 * Self-hosted admin override: grants Ultra tier to specific accounts without
 * needing WorkOS Entitlements/RBAC configured. Set
 * NEXT_PUBLIC_SELF_HOSTED_ADMIN_EMAILS to a comma-separated list of emails
 * (in .env.local for Next.js, and via `npx convex env set` for Convex - they
 * run as separate deployments with separate env storage). Uses a
 * NEXT_PUBLIC_ var (not a secret) so both server-side checks and
 * GlobalState's client-side entitlements resolution apply the same override.
 */
const getAdminOverrideEmails = (): string[] =>
  (process.env.NEXT_PUBLIC_SELF_HOSTED_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const isAdminOverrideEmail = (email: string | null | undefined): boolean =>
  !!email && getAdminOverrideEmails().includes(email.toLowerCase());

export function applyAdminTierOverride(
  subscription: SubscriptionTier,
  email: string | null | undefined,
): SubscriptionTier {
  return isAdminOverrideEmail(email) ? "ultra" : subscription;
}

export function hasPaidEntitlement(
  entitlements: readonly string[],
  email?: string | null,
): boolean {
  return (
    resolveSubscriptionTier(entitlements) !== "free" ||
    isAdminOverrideEmail(email)
  );
}
