import { AdOffersBoard } from "@/components/ad-offers/ad-offers-board";
import { AppShell } from "@/components/app/app-shell";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function AdOffersPage() {
  return (
    <AppShell>
      <AdOffersBoard />
    </AppShell>
  );
}
