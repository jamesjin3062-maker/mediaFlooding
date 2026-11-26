import { AppShell } from "@/components/app/app-shell";
import { WalletBoard } from "@/components/wallet/wallet-board";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function WalletPage() {
  return (
    <AppShell>
      <WalletBoard />
    </AppShell>
  );
}
