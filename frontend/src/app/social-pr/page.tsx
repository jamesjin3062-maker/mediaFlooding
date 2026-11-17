import { AppShell } from "@/components/app/app-shell";
import { SectionPage } from "@/components/app/section-page";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function AdOffersPage() {
  return (
    <AppShell>
      <SectionPage title="Ad Offers" body="Paid posts and social PR offers." />
    </AppShell>
  );
}
