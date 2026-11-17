import { AppShell } from "@/components/app/app-shell";
import { SectionPage } from "@/components/app/section-page";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function ReferPage() {
  return (
    <AppShell>
      <SectionPage title="Refer & Earn" body="Share your link and earn when someone joins." />
    </AppShell>
  );
}
