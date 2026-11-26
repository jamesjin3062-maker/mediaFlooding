import { AppShell } from "@/components/app/app-shell";
import { SubmissionsBoard } from "@/components/submissions/submissions-board";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function SubmissionsPage() {
  return (
    <AppShell>
      <SubmissionsBoard />
    </AppShell>
  );
}
