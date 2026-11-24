"use client";

import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";

import { CampaignCard } from "@/components/campaigns/campaign-card";
import { campaignMembership, type Campaign, type CampaignList } from "@/lib/clipstake";

export function CampaignsBoard() {
  const [list, setList] = useState<CampaignList | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/campaigns")
      .then(async (response) => {
        const body = await response.json().catch(() => null);
        if (!response.ok) throw new Error("Could not load campaigns.");
        return body as CampaignList;
      })
      .then((body) => {
        if (!cancelled) setList(body);
      })
      .catch((loadError: Error) => {
        if (!cancelled) setError(loadError.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const campaigns = list?.data ?? [];
  const active = campaigns.filter((campaign) => campaignMembership(campaign) === "open");

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 md:py-10">
      <section>
        <h1 className="flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
          Active campaigns
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{active.length}</span>
        </h1>
        {active.length === 0 ? (
          <div className="mt-4 flex h-28 flex-col items-center justify-center gap-2 rounded-xl border bg-card text-sm text-muted-foreground">
            <Megaphone className="size-4" />
            No campaigns open to you right now.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {active.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          Organizations
          <span className="text-sm font-medium text-muted-foreground">{campaigns.length}</span>
        </h2>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        {!list && !error ? <p className="mt-3 text-sm text-muted-foreground">Loading campaigns…</p> : null}
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign: Campaign) => <CampaignCard key={campaign.id} campaign={campaign} />)}
        </div>
        {list?.notice ? <p className="mt-4 text-xs text-muted-foreground">{list.notice}</p> : null}
      </section>
    </main>
  );
}
