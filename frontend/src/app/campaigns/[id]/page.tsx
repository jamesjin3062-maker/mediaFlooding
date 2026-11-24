"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { CampaignMark, MembershipPill } from "@/components/campaigns/campaign-card";
import { CampaignCopy } from "@/components/campaigns/campaign-copy";
import { campaignToneIndex } from "@/lib/campaign-mark";
import { campaignCopyKey } from "@/lib/campaign-copy";
import { campaignMembership, geoRateLabel, platformLabel, postingRule, type Campaign } from "@/lib/clipstake";
import { cn } from "@/lib/utils";

const DETAIL_GLOWS = [
  "bg-lime-300/20",
  "bg-orange-300/20",
  "bg-sky-300/20",
  "bg-violet-300/20",
  "bg-rose-300/20",
  "bg-amber-200/20",
  "bg-emerald-300/20",
  "bg-fuchsia-300/20",
] as const;

function CampaignSections({ about, instructions }: { about: string; instructions: string }) {
  const same = campaignCopyKey(about) !== "" && campaignCopyKey(about) === campaignCopyKey(instructions);
  const showInstructions = instructions.trim().length > 0 && !same;
  return (
    <>
      {about.trim() ? (
        <section className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wide text-white/40">About</h2>
          <CampaignCopy value={about} className="text-white/80" />
        </section>
      ) : null}
      {showInstructions ? (
        <section className="space-y-2">
          <h2 className="text-xs font-medium uppercase tracking-wide text-white/40">Instructions</h2>
          <CampaignCopy value={instructions} className="text-white/70" />
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
      <main className="min-h-full bg-[#0c0c0c] px-4 py-6 text-white sm:px-8">
        <Link href="/campaigns" className="text-sm text-white/50 hover:text-white">Campaigns</Link>
        {error ? <p className="mt-6 text-sm text-red-400">{error}</p> : null}
        {!campaign && !error ? <p className="mt-6 text-sm text-white/45">Loading campaign…</p> : null}
        {campaign ? (
          <article className="mt-4 max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#161616]">
            <div className="relative overflow-hidden px-5 py-6">
              <div className={cn("pointer-events-none absolute -right-10 -top-16 size-48 rounded-full blur-3xl", DETAIL_GLOWS[campaignToneIndex(campaign.brand_name)])} />
              <div className="relative flex items-start gap-4">
                <CampaignMark name={campaign.brand_name} className="size-14 rounded-2xl text-base" />
                <div className="min-w-0">
                  <h1 className="text-2xl font-semibold leading-tight">{campaign.name}</h1>
                  <p className="mt-1 text-sm text-white/45">{campaign.brand_name}</p>
                  {membership ? <div className="mt-3"><MembershipPill membership={membership} /></div> : null}
                </div>
              </div>
            </div>
            <div className="space-y-4 px-5 pb-5">
              <CampaignSections about={campaign.about} instructions={campaign.instructions} />
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-white/40">Platforms</dt>
                  <dd>{campaign.platforms.map((item) => platformLabel(item.platform)).join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="text-white/40">Clips submitted</dt>
                  <dd>{campaign.clip_count} / {campaign.max_clips}</dd>
                </div>
                {campaign.geo_rates.length > 0 ? (
                  <div className="sm:col-span-2">
                    <dt className="text-white/40">Country rates</dt>
                    <dd className="mt-1 space-y-1">
                      {campaign.geo_rates.map((rate) => (
                        <p key={`${rate.kind}:${rate.countries.join(",")}`}>{geoRateLabel(rate)}</p>
                      ))}
                    </dd>
                  </div>
                ) : null}
                {posting ? (
                  <div className="sm:col-span-2">
                    <dt className="text-white/40">Posts accepted</dt>
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
