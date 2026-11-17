import { AppShell } from "@/components/app/app-shell";
import { SectionPage } from "@/components/app/section-page";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function AnnouncementsPage() {
  return (
    <AppShell>
      <SectionPage title="Announcements" body="News and updates for clippers." />
    </AppShell>
  );
}
