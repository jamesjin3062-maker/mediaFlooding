import { RateCard } from "@/components/ad-offers/rate-card";
import { AppShell } from "@/components/app/app-shell";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function RateCardPage() {
  return (
    <AppShell>
      <RateCard />
    </AppShell>
  );
}
