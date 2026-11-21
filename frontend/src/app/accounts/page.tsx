import { AppShell } from "@/components/app/app-shell";
import { AccountsBoard } from "@/components/accounts/accounts-board";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default function AccountsPage() {
  return (
    <AppShell>
      <AccountsBoard />
    </AppShell>
  );
}
