import { AppShell } from "@/components/app/app-shell";
import { CampaignsBoard } from "@/components/campaigns/campaigns-board";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function CampaignsPage() {
  return (
    <AppShell>
      <CampaignsBoard />
    </AppShell>
  );
}
