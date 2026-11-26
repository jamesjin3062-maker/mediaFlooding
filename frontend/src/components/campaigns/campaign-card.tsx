import Link from "next/link";

import { campaignInitials, campaignToneIndex } from "@/lib/campaign-mark";
import { calm, calmMarks } from "@/lib/calm-color";
import { campaignMembership, campaignPayLabel, membershipLabel, platformLabel, type Campaign, type CampaignMembership } from "@/lib/clipstake";
import { cn } from "@/lib/utils";

export function CampaignMark({ name, className }: { name: string; className?: string }) {
  const tone = calmMarks[campaignToneIndex(name) % calmMarks.length] ?? calm.slate.surface;
  return (
    <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tracking-wide", tone, className)}>
      {campaignInitials(name)}
    </div>
  );
}

export function MembershipPill({ membership }: { membership: CampaignMembership }) {
  const tone = membership === "pending" ? calm.sand : membership === "closed" ? null : calm.sage;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium", tone?.surface ?? "bg-muted text-muted-foreground")}>
      <span className={cn("size-1.5 rounded-full", tone?.dot ?? "bg-muted-foreground/50")} />
      {membershipLabel(membership)}
    </span>
  );
}

export function CampaignCard({ campaign, compact = false }: { campaign: Campaign; compact?: boolean }) {
  const membership = campaignMembership(campaign);
  const pay = campaignPayLabel(campaign);
  return (
    <Link href={`/campaigns/${campaign.id}`} className={cn("group flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm transition-colors hover:border-foreground/20", compact ? "min-h-36 p-3" : "min-h-44 p-4")}>
      <div className="flex items-start justify-between gap-3">
        <CampaignMark name={campaign.brand_name} className={compact ? "size-9 rounded-lg text-xs" : undefined} />
        <MembershipPill membership={membership} />
      </div>
      <div className={cn("mt-auto", compact ? "pt-4" : "pt-6")}>
        <h3 className={cn("line-clamp-2 font-display font-semibold leading-5", compact ? "text-sm" : "text-base")}>{campaign.name}</h3>
        <p className={cn("mt-1 truncate text-muted-foreground", compact ? "text-xs" : "text-sm")}>{campaign.brand_name}</p>
        <div className={cn("flex flex-wrap items-center gap-1.5", compact ? "mt-2" : "mt-3")}>
          {campaign.platforms.map((item) => (
            <span key={item.platform} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{platformLabel(item.platform)}</span>
          ))}
          {pay ? <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-foreground">{pay}</span> : null}
        </div>
      </div>
    </Link>
  );
}
