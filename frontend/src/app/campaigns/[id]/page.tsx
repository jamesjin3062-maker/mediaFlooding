"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { CampaignCopy } from "@/components/campaigns/campaign-copy";
import { campaignCopyKey } from "@/lib/campaign-copy";
import { campaignMembership, membershipLabel, type Campaign } from "@/lib/clipstake";

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

  return (
    <AppShell>
      <main className="min-h-full bg-[#0c0c0c] px-4 py-6 text-white sm:px-8">
        <Link href="/campaigns" className="text-sm text-white/50 hover:text-white">Campaigns</Link>
        {error ? <p className="mt-6 text-sm text-red-400">{error}</p> : null}
        {!campaign && !error ? <p className="mt-6 text-sm text-white/45">Loading campaign…</p> : null}
        {campaign ? (
          <article className="mt-4 max-w-3xl overflow-hidden rounded-xl border border-white/10 bg-[#141414]">
            <div className="relative h-40">
              <img src={campaign.banner} alt="" className="h-full w-full object-cover" />
              <img src={campaign.logo} alt="" className="absolute bottom-4 left-4 size-14 rounded-xl border border-black/40 bg-black object-cover" />
            </div>
            <div className="space-y-4 px-5 py-5">
              <div>
                <h1 className="text-2xl font-semibold">{campaign.name}</h1>
                <p className="text-sm text-white/45">by {campaign.brand_name}</p>
                {membership ? <p className="mt-2 text-sm text-emerald-400">{membershipLabel(membership)}</p> : null}
              </div>
              <CampaignSections about={campaign.about} instructions={campaign.instructions} />
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-white/40">Platforms</dt>
                  <dd>{campaign.platforms.map((item) => item.platform).join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="text-white/40">Clips submitted</dt>
                  <dd>{campaign.clip_count} / {campaign.max_clips}</dd>
                </div>
              </dl>
            </div>
          </article>
        ) : null}
      </main>
    </AppShell>
  );
}
