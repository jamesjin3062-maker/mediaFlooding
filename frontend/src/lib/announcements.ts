export type Announcement = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  href: string;
  action: string;
};

const SEEDED_ANNOUNCEMENT_ID = "creator-program-2026-10";
const SEEDED_ANNOUNCEMENT_TITLE = "The creator program is open";

/** The first seeded row still describes the old product. Serve the current copy until that row is edited. */
export function presentAnnouncement<T extends Announcement>(item: T): T {
  if (item.id !== SEEDED_ANNOUNCEMENT_ID || item.title !== SEEDED_ANNOUNCEMENT_TITLE) return item;
  return {
    ...item,
    title: "Campaigns are open",
    description: "Open campaigns are ready for clips. Review a brief, post it, and submit the link.",
    href: "/announcements",
    action: "View announcements",
  };
}

const FEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "submissions-2026-11",
    title: "Submissions are on one page",
    description: "Clip links you submit are listed together.\n\nFilter by pending, approved, or denied. Search by the link, the caption, or the page.",
    publishedAt: "2026-11-24T16:00:00Z",
    href: "/submissions",
    action: "Open submissions",
  },
  {
    id: "ad-offers-2026-11",
    title: "Ad offers have their own page",
    description: "When a brand offers to run a paid ad on a verified page, it shows up under Ad Offers.\n\nThe rate card is where a price can be set for a post or a video.",
    publishedAt: "2026-11-22T16:00:00Z",
    href: "/social-pr",
    action: "Open ad offers",
  },
  {
    id: "bounties-2026-11",
    title: "Bounties are open",
    description: "Fixed-reward briefs are listed as cards.\n\nOpen a card for the brief, the reward, and how many spots are left.",
    publishedAt: "2026-11-19T16:00:00Z",
    href: "/bounties",
    action: "Browse bounties",
  },
  {
    id: "wallet-2026-11",
    title: "Wallet is ready to review",
    description: "Available balance and payout activity live on the Wallet page.\n\nPayout setup stays on that page. Nothing is sent until setup is connected.",
    publishedAt: "2026-11-12T16:00:00Z",
    href: "/wallet",
    action: "Open wallet",
  },
];

/** Published rows, plus the built-in posts that are not already stored. */
export function withFeedAnnouncements<T extends Announcement>(items: T[]): Announcement[] {
  const seen = new Set(items.map((item) => item.id));
  return [...items.map(presentAnnouncement), ...FEED_ANNOUNCEMENTS.filter((item) => !seen.has(item.id))]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export type ManagedAnnouncement = Announcement & { isPublished: boolean };

export const ANNOUNCEMENTS_UPDATED_EVENT = "supoclip:announcements-updated";
