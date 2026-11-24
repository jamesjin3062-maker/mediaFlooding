import Link from "next/link";

import { campaignInitials, campaignToneIndex } from "@/lib/campaign-mark";
import { campaignMembership, campaignPayLabel, membershipLabel, platformLabel, type Campaign, type CampaignMembership } from "@/lib/clipstake";
import { cn } from "@/lib/utils";

const TONES = [
  { chip: "bg-lime-300", glow: "bg-lime-300/25" },
  { chip: "bg-orange-300", glow: "bg-orange-300/25" },
  { chip: "bg-sky-300", glow: "bg-sky-300/25" },
  { chip: "bg-violet-300", glow: "bg-violet-300/25" },
  { chip: "bg-rose-300", glow: "bg-rose-300/25" },
  { chip: "bg-amber-200", glow: "bg-amber-200/25" },
  { chip: "bg-emerald-300", glow: "bg-emerald-300/25" },
  { chip: "bg-fuchsia-300", glow: "bg-fuchsia-300/25" },
] as const;

export function CampaignMark({ name, className }: { name: string; className?: string }) {
  const tone = TONES[campaignToneIndex(name)];
  return (
    <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tracking-wide text-black", tone.chip, className)}>
      {campaignInitials(name)}
    </div>
  );
}

export function MembershipPill({ membership }: { membership: CampaignMembership }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium",
      membership === "open" && "bg-emerald-400/15 text-emerald-300",
      membership === "apply" && "bg-emerald-400/15 text-emerald-300",
      membership === "pending" && "bg-amber-400/15 text-amber-300",
      membership === "closed" && "bg-white/10 text-white/45",
    )}>
      <span className={cn(
        "size-1.5 rounded-full",
        membership === "open" && "bg-emerald-300",
        membership === "apply" && "bg-emerald-300",
        membership === "pending" && "bg-amber-300",
        membership === "closed" && "bg-white/35",
      )} />
      {membershipLabel(membership)}
    </span>
  );
}

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const membership = campaignMembership(campaign);
  const tone = TONES[campaignToneIndex(campaign.brand_name)];
  const pay = campaignPayLabel(campaign);
  return (
    <Link href={`/campaigns/${campaign.id}`} className="group relative flex min-h-44 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161616] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-white/25">
      <div className={cn("pointer-events-none absolute -right-8 -top-12 size-36 rounded-full blur-2xl", tone.glow)} />
      <div className="relative flex items-start justify-between gap-3">
        <CampaignMark name={campaign.brand_name} />
        <MembershipPill membership={membership} />
      </div>
      <div className="relative mt-auto pt-6">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-5 text-white">{campaign.name}</h3>
        <p className="mt-1 truncate text-sm text-white/45">{campaign.brand_name}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {campaign.platforms.map((item) => (
            <span key={item.platform} className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] text-white/75">{platformLabel(item.platform)}</span>
          ))}
          {pay ? <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white">{pay}</span> : null}
        </div>
      </div>
    </Link>
  );
}
