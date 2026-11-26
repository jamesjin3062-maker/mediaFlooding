import { AppShell } from "@/components/app/app-shell";
import { CampaignsBoard } from "@/components/campaigns/campaigns-board";
import { listCampaigns } from "@/lib/clipstake";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default async function CampaignsPage() {
  const list = await listCampaigns().catch(() => null);
  return (
    <AppShell>
      <CampaignsBoard initialList={list} />
    </AppShell>
  );
}
