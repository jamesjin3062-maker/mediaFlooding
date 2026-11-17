/**
 * Single registry of indexable marketing pages. The landing page and footer
 * link from here so new pages are never orphaned.
 */
export type MarketingLinkGroup = "product" | "guide" | "comparison";

export interface MarketingLink {
  /** English-only editorial destinations keep their English navigation labels. */
  language?: "en";
  href: string;
  group: MarketingLinkGroup;
  eyebrow: string;
  title: string;
  /** Short footer label. */
  label: string;
  description: string;
  /** Hand-picked next reads, in priority order. */
  related: string[];
}

export const marketingLinks: MarketingLink[] = [
  {
    href: "/demo",
    group: "product",
    eyebrow: "Demo",
    title: "See real clips SupoClip made from a long video",
    label: "Demo",
    description: "Watch the output, then jump to each moment in the original source video.",
    related: [],
  },
];

export function getMarketingLink(href: string) {
  return marketingLinks.find((link) => link.href === href);
}

export function getMarketingLinks(group: MarketingLinkGroup) {
  return marketingLinks.filter((link) => link.group === group);
}

export function getRelatedMarketingLinks(href: string): MarketingLink[] {
  return (getMarketingLink(href)?.related ?? [])
    .map(getMarketingLink)
    .filter((link): link is MarketingLink => Boolean(link));
}
