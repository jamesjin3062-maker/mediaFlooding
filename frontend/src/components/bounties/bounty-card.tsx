import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";

import { calm } from "@/lib/calm-color";
import { bountyPlatformLabel, bountyReward, bountyStatusLabel, type Bounty, type BountyPlatform } from "@/lib/bounties";
import { cn } from "@/lib/utils";

export function BountyStatusPill({ status }: { status: Bounty["status"] }) {
  const tone = status === "open" ? calm.sage : null;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium", tone?.surface ?? "bg-muted text-muted-foreground")}>
      <span className={cn("size-1.5 rounded-full", tone?.dot ?? "bg-muted-foreground/50")} />
      {bountyStatusLabel(status)}
    </span>
  );
}

function PlatformIcon({ platform }: { platform: BountyPlatform }) {
  const label = bountyPlatformLabel(platform);
  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-label={label} role="img">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (platform === "youtube") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-label={label} role="img">
        <rect x="2.5" y="6" width="19" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <path fill="currentColor" d="M11 10.2v3.6l3.2-1.8L11 10.2Z" />
      </svg>
    );
  }
  if (platform === "x") {
    return (
      <svg viewBox="0 0 24 24" className="size-4" aria-label={label} role="img">
        <path fill="currentColor" d="M4 4h4.2l3.7 5.2L16.2 4H20l-6.3 8.1L20.4 20h-4.2l-4.1-5.7L7.4 20H3.6l6.7-8.6L4 4Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-label={label} role="img" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export function BountyCard({ bounty }: { bounty: Bounty }) {
  const platform = bounty.platforms[0];
  return (
    <Link href={`/bounties/${bounty.id}`} className="flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground transition-colors hover:border-foreground/20">
      <div className="px-4 pb-4 pt-3.5">
        <div className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[oklch(0.45_0.08_150)] text-xs font-bold text-white dark:bg-[oklch(0.7_0.1_145)] dark:text-[oklch(0.2_0.03_145)]">
              {bounty.brand.trim().charAt(0).toUpperCase()}
            </span>
            <span className="truncate text-sm font-medium">{bounty.brand}</span>
          </span>
          {platform ? <span className="shrink-0 text-foreground/80"><PlatformIcon platform={platform} /></span> : null}
        </div>
        <h2 className="mt-4 text-[15px] font-semibold leading-snug">{bounty.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{bounty.action}</p>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t px-4 py-3">
        <p className="flex min-w-0 items-center gap-1.5">
          <span className="text-lg font-semibold tabular-nums tracking-tight text-[oklch(0.42_0.08_150)] dark:text-[oklch(0.78_0.1_145)]">{bountyReward(bounty.rewardCents)}</span>
          <Gift className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">× {bounty.spotsLeft}</span>
        </p>
        <span className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg bg-[oklch(0.45_0.08_150)] px-3 text-sm font-semibold text-white dark:bg-[oklch(0.7_0.1_145)] dark:text-[oklch(0.2_0.03_145)]">
          Claim
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
