"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { CampaignMark, MembershipPill } from "@/components/campaigns/campaign-card";
import { CampaignCopy } from "@/components/campaigns/campaign-copy";
import { campaignCopyKey } from "@/lib/campaign-copy";
import { campaignMembership, geoRateLabel, platformLabel, postingRule, type Campaign } from "@/lib/clipstake";

function CampaignSections({ about, instructions }: { about: string; instructions: string }) {
  const same = campaignCopyKey(about) !== "" && campaignCopyKey(about) === campaignCopyKey(instructions);
  const showInstructions = instructions.trim().length > 0 && !same;
  return (
    <>
      {about.trim() ? (
        <section className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">About</h2>
          <CampaignCopy value={about} className="text-foreground" />
        </section>
      ) : null}
      {showInstructions ? (
        <section className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Instructions</h2>
          <CampaignCopy value={instructions} className="text-muted-foreground" />
        </section>
      ) : null}
    </>
  );
}

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/campaigns/${params.id}`)
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || "Could not load that campaign.");
        return body.campaign as Campaign;
      })
      .then((body) => {
        if (!cancelled) setCampaign(body);
      })
      .catch((loadError: Error) => {
        if (!cancelled) setError(loadError.message);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const membership = campaign ? campaignMembership(campaign) : null;
  const posting = campaign ? postingRule(campaign) : null;

  return (
    <AppShell>
      <main className="w-full px-4 py-8 sm:px-6 md:py-10">
        <Link href="/campaigns" className="text-sm text-muted-foreground hover:text-foreground">Campaigns</Link>
        {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}
        {!campaign && !error ? <p className="mt-6 text-sm text-muted-foreground">Loading campaign…</p> : null}
        {campaign ? (
          <article className="mt-4 overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex items-start gap-4 px-5 py-6">
              <CampaignMark name={campaign.brand_name} className="size-14 rounded-2xl text-base" />
              <div className="min-w-0">
                <h1 className="font-display text-3xl font-bold tracking-tight">{campaign.name}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{campaign.brand_name}</p>
                {membership ? <div className="mt-3"><MembershipPill membership={membership} /></div> : null}
              </div>
            </div>
            <div className="space-y-4 px-5 pb-6">
              <CampaignSections about={campaign.about} instructions={campaign.instructions} />
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Platforms</dt>
                  <dd>{campaign.platforms.map((item) => platformLabel(item.platform)).join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Clips submitted</dt>
                  <dd>{campaign.clip_count} / {campaign.max_clips}</dd>
                </div>
                {campaign.geo_rates.length > 0 ? (
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Country rates</dt>
                    <dd className="mt-1 space-y-1">
                      {campaign.geo_rates.map((rate) => (
                        <p key={`${rate.kind}:${rate.countries.join(",")}`}>{geoRateLabel(rate)}</p>
                      ))}
                    </dd>
                  </div>
                ) : null}
                {posting ? (
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Posts accepted</dt>
                    <dd className="mt-1">{posting}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </article>
        ) : null}
      </main>
    </AppShell>
  );
}
