import { AppShell } from "@/components/app/app-shell";
import { SectionPage } from "@/components/app/section-page";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function WalletPage() {
  return (
    <AppShell>
      <SectionPage title="Wallet" body="Your balance and payouts from submitted clips." />
    </AppShell>
  );
}
