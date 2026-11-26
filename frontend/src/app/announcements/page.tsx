import { AnnouncementsFeed } from "@/components/app/announcements-feed";
import { AppShell } from "@/components/app/app-shell";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default async function AnnouncementsPage({ searchParams }: { searchParams: Promise<{ post?: string }> }) {
  const { post } = await searchParams;
  return (
    <AppShell>
      <AnnouncementsFeed initialPostId={post ?? null} />
    </AppShell>
  );
}
