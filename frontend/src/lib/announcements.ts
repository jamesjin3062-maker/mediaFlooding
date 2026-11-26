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

export type ManagedAnnouncement = Announcement & { isPublished: boolean };

export const ANNOUNCEMENTS_UPDATED_EVENT = "supoclip:announcements-updated";
