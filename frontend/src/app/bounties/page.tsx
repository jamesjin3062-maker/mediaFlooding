import { AppShell } from "@/components/app/app-shell";
import { BountiesBoard } from "@/components/bounties/bounties-board";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function BountiesPage() {
  return (
    <AppShell>
      <BountiesBoard />
    </AppShell>
  );
}
