import Link from "next/link";

import { AppShell } from "@/components/app/app-shell";
import { BountyStatusPill } from "@/components/bounties/bounty-card";
import { CampaignMark } from "@/components/campaigns/campaign-card";
import { bountyDeadline, bountyPlatformLabel, bountyReward, getBounty } from "@/lib/bounties";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata;

export default async function BountyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bounty = getBounty(id);

  return (
    <AppShell>
      <main className="w-full px-4 py-8 sm:px-6 md:py-10">
        <Link href="/bounties" className="text-sm text-muted-foreground hover:text-foreground">Bounties</Link>
        {!bounty ? <p className="mt-6 text-sm text-muted-foreground">That bounty is not on this list.</p> : null}
        {bounty ? (
          <div className="mt-4 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <article className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
              <div className="flex items-start gap-4">
                <CampaignMark name={bounty.brand} className="size-14 rounded-2xl text-base" />
                <div className="min-w-0">
                  <h1 className="font-display text-3xl font-bold tracking-tight">{bounty.title}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{bounty.brand}</p>
                  <div className="mt-3"><BountyStatusPill status={bounty.status} /></div>
                </div>
              </div>
              <section className="mt-6 space-y-2">
                <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">About</h2>
                <p className="text-sm leading-6">{bounty.about}</p>
              </section>
              <section className="mt-6 space-y-2">
                <h2 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Requirements</h2>
                <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                  {bounty.requirements.map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
              </section>
            </article>
            <aside className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
              <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">FIXED REWARD</p>
              <p className="mt-2 font-display text-4xl font-semibold tabular-nums tracking-tight">{bountyReward(bounty.rewardCents)}</p>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Spots left</dt>
                  <dd>{bounty.spotsLeft}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Ends</dt>
                  <dd>{bountyDeadline(bounty.deadline)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Platforms</dt>
                  <dd>{bounty.platforms.map(bountyPlatformLabel).join(", ")}</dd>
                </div>
              </dl>
              <Link
                href="/create"
                className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[oklch(0.89_0.19_128)] text-sm font-semibold text-[oklch(0.22_0.04_130)] hover:brightness-105"
              >
                Make this clip
              </Link>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">Post it on an accepted platform. Submitting the link for this bounty is not connected yet.</p>
            </aside>
          </div>
        ) : null}
      </main>
    </AppShell>
  );
}
