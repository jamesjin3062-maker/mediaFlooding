import { AppShell } from "@/components/app/app-shell";
import { SectionPage } from "@/components/app/section-page";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function BountiesPage() {
  return (
    <AppShell>
      <SectionPage title="Bounties" body="Paid clipping jobs you can take." />
    </AppShell>
  );
}
