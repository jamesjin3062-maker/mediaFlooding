import { AppShell } from "@/components/app/app-shell";
import { MessagesBoard } from "@/components/messages/messages-board";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function MessagesPage() {
  return (
    <AppShell>
      <MessagesBoard />
    </AppShell>
  );
}
