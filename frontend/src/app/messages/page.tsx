import { AppShell } from "@/components/app/app-shell";
import { SectionPage } from "@/components/app/section-page";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function MessagesPage() {
  return (
    <AppShell>
      <SectionPage title="Messages" body="Messages from campaigns and other clippers." />
    </AppShell>
  );
}
