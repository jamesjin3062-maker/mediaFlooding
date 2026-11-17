import { AppShell } from "@/components/app/app-shell";
import { SectionPage } from "@/components/app/section-page";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function DashboardPage() {
  return (
    <AppShell>
      <SectionPage title="Dashboard" body="Campaigns, submissions, and earnings for your clipper account." />
    </AppShell>
  );
}
