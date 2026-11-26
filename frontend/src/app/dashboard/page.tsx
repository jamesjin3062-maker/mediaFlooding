import { AppShell } from "@/components/app/app-shell";
import { DashboardBoard } from "@/components/dashboard/dashboard-board";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function DashboardPage() {
  return (
    <AppShell>
      <DashboardBoard />
    </AppShell>
  );
}
