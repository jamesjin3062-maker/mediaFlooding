import { AppShell } from "@/components/app/app-shell";
import { AccountDetail } from "@/components/accounts/account-detail";
import { listAccounts } from "@/lib/clipstake-accounts";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default async function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = await listAccounts().catch(() => null);
  const account = list?.data.find((item) => item.id === id) ?? null;
  return (
    <AppShell>
      <AccountDetail id={id} initialAccount={account} initialMissing={list !== null && account === null} />
    </AppShell>
  );
}
