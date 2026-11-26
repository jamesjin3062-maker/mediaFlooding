import { AppShell } from "@/components/app/app-shell";
import { AccountsBoard } from "@/components/accounts/accounts-board";
import { listAccounts } from "@/lib/clipstake-accounts";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default async function AccountsPage() {
  const list = await listAccounts().catch(() => null);
  return (
    <AppShell>
      <AccountsBoard initialList={list} />
    </AppShell>
  );
}
