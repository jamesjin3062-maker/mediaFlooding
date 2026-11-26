import { AppShell } from "@/components/app/app-shell";
import { DashboardBoard } from "@/components/dashboard/dashboard-board";
import { listAccounts } from "@/lib/clipstake-accounts";
import { listCampaigns } from "@/lib/clipstake";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default async function DashboardPage() {
  const [campaigns, accounts] = await Promise.all([
    listCampaigns().catch(() => null),
    listAccounts().catch(() => null),
  ]);
  return (
    <AppShell>
      <DashboardBoard initialCampaigns={campaigns} initialAccounts={accounts} />
    </AppShell>
  );
}
