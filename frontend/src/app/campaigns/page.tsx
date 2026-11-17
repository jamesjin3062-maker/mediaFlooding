import { AppShell } from "@/components/app/app-shell";
import { SectionPage } from "@/components/app/section-page";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function CampaignsPage() {
  return (
    <AppShell>
      <SectionPage title="Campaign" body="Campaigns to clip for. Make the short in Clipper, then submit it." />
    </AppShell>
  );
}
