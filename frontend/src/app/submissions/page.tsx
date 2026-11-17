import { AppShell } from "@/components/app/app-shell";
import { SectionPage } from "@/components/app/section-page";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function SubmissionsPage() {
  return (
    <AppShell>
      <SectionPage title="Submissions" body="Clips you have submitted to campaigns." />
    </AppShell>
  );
}
