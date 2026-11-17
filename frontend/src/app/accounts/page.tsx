import { AppShell } from "@/components/app/app-shell";
import { SectionPage } from "@/components/app/section-page";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function AccountsPage() {
  return (
    <AppShell>
      <SectionPage title="Accounts" body="Social accounts used when a campaign asks you to post." />
    </AppShell>
  );
}
