import Link from "next/link";

import { campaignMembership, membershipLabel, type Campaign } from "@/lib/clipstake";
import { cn } from "@/lib/utils";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const membership = campaignMembership(campaign);
  return (
    <Link href={`/campaigns/${campaign.id}`} className="block overflow-hidden rounded-xl border border-white/10 bg-[#141414] transition-colors hover:border-white/25">
      <div className="relative h-28 bg-black">
        <img src={campaign.banner} alt="" className="h-full w-full object-cover" />
        <img src={campaign.logo} alt="" className="absolute bottom-3 left-3 size-11 rounded-lg border border-black/40 bg-black object-cover shadow-md" />
      </div>
      <div className="space-y-1 px-3 py-3">
        <p className="truncate text-sm font-semibold text-white">
          {campaign.name} <span className="font-normal text-white/45">by {campaign.brand_name}</span>
        </p>
        <p className={cn(
          "text-xs",
          membership === "apply" && "text-emerald-400",
          membership === "pending" && "text-amber-500",
          membership === "open" && "text-emerald-300",
          membership === "closed" && "text-white/40",
        )}>
          {membershipLabel(membership)}
        </p>
      </div>
    </Link>
  );
}
