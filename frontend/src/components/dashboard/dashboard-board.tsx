"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FileText } from "lucide-react";

import { CampaignMark, MembershipPill } from "@/components/campaigns/campaign-card";
import { campaignMembership, campaignPayLabel, type Campaign, type CampaignList } from "@/lib/clipstake";
import { canSubmitAccount, type AccountList } from "@/lib/clipstake-accounts";

export function DashboardBoard() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [accounts, setAccounts] = useState<number | null>(null);
  const [readyAccounts, setReadyAccounts] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/campaigns")
      .then(async (response) => response.ok ? response.json() as Promise<CampaignList> : null)
      .then((body) => {
        if (!cancelled) setCampaigns(body?.data ?? []);
      })
      .catch(() => {
        if (!cancelled) setCampaigns([]);
      });
    void fetch("/api/accounts")
      .then(async (response) => response.ok ? response.json() as Promise<AccountList> : null)
      .then((body) => {
        if (cancelled) return;
        const rows = body?.data ?? [];
        setAccounts(rows.length);
        setReadyAccounts(rows.filter((account) => canSubmitAccount(account)).length);
      })
      .catch(() => {
        if (!cancelled) {
          setAccounts(0);
          setReadyAccounts(0);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const open = (campaigns ?? []).filter((campaign) => campaignMembership(campaign) === "open");

  return (
    <main className="w-full px-4 py-6 sm:px-6 md:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">AVAILABLE FOR WITHDRAWAL</p>
          <p className="mt-2 font-display text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl">$0.00</p>
          <p className="mt-2 text-sm text-muted-foreground">Earnings show here after a submitted clip has verified views.</p>
        </div>
        <Link href="/wallet" className="inline-flex h-10 items-center rounded-xl border border-white/15 px-4 text-sm text-muted-foreground hover:text-foreground">
          Withdraw
        </Link>
      </div>

      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Open campaigns" value={campaigns ? String(open.length) : "—"} />
        <Stat label="Accounts" value={accounts === null ? "—" : String(accounts)} />
        <Stat label="Ready to submit" value={readyAccounts === null ? "—" : String(readyAccounts)} />
      </dl>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-xl border border-white/15">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <h2 className="font-display text-lg font-semibold">Campaigns</h2>
            <Link href="/campaigns" className="text-sm text-muted-foreground hover:text-foreground">See all</Link>
          </div>
          {campaigns === null ? <p className="px-4 py-8 text-sm text-muted-foreground">Loading campaigns…</p> : null}
          {campaigns && open.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">No campaigns open to you right now.</p>
          ) : null}
          <ul>
            {open.slice(0, 6).map((campaign) => {
              const pay = campaignPayLabel(campaign);
              return (
                <li key={campaign.id} className="border-b border-white/10 last:border-b-0">
                  <Link href={`/campaigns/${campaign.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03]">
                    <CampaignMark name={campaign.brand_name} className="size-9 rounded-lg text-xs" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{campaign.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{campaign.brand_name}{pay ? ` · ${pay}` : ""}</span>
                    </span>
                    <MembershipPill membership={campaignMembership(campaign)} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="flex min-h-64 flex-col rounded-xl border border-white/15">
          <h2 className="border-b border-white/10 px-4 py-3 font-display text-lg font-semibold">Activity</h2>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
            <span className="flex size-10 items-center justify-center rounded-lg border border-white/15 text-muted-foreground">
              <FileText className="size-4" />
            </span>
            <p className="text-sm font-medium">No activity yet</p>
            <p className="max-w-[16rem] text-sm text-muted-foreground">Verified views and payouts will show up here.</p>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/15 px-4 py-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}
