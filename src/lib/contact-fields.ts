import { ContactKind } from "@/generated/prisma/enums";

/**
 * The three contact tabs, shared by the admin list, the CSV export and the
 * public form's `details` mapping — so a field added in one place cannot be
 * forgotten in the others.
 */

export const CONTACT_TABS = [
  {
    slug: "perform",
    kind: ContactKind.PERFORM,
    label: "Artists",
    fields: ["bandName", "genre", "members", "city", "zip", "manager", "website", "socials"],
  },
  { slug: "venue", kind: ContactKind.VENUE, label: "Venues", fields: ["address", "type"] },
  {
    slug: "volunteer",
    kind: ContactKind.VOLUNTEER,
    label: "Volunteers",
    fields: ["skill"],
  },
] as const;

export type ContactTab = (typeof CONTACT_TABS)[number];

/** Human labels for the JSON `details` keys. */
export const FIELD_LABELS: Record<string, string> = {
  bandName: "Band",
  genre: "Genre",
  members: "Members",
  city: "City",
  zip: "ZIP",
  manager: "Manager",
  website: "Website",
  socials: "Socials",
  address: "Address",
  type: "Type of space",
  skill: "Skill",
};

export function labelFor(field: string): string {
  return FIELD_LABELS[field] ?? field;
}

export function tabBySlug(slug: string | undefined): ContactTab {
  return CONTACT_TABS.find((tab) => tab.slug === slug) ?? CONTACT_TABS[0];
}

/** Turns the stored JSON blob into ordered, labelled pairs for display. */
export function detailEntries(details: unknown): [string, string][] {
  if (!details || typeof details !== "object" || Array.isArray(details)) return [];
  return Object.entries(details as Record<string, unknown>)
    .filter(([, value]) => value !== null && value !== undefined && String(value) !== "")
    .map(([key, value]) => [labelFor(key), String(value)]);
}
