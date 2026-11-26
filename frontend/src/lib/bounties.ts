import { formatCents } from "@/lib/clipstake";

export type BountyPlatform = "instagram" | "tiktok" | "youtube" | "x";
export type BountyStatus = "open" | "closed";

export type Bounty = {
  id: string;
  title: string;
  brand: string;
  action: string;
  rewardCents: number;
  spotsLeft: number;
  deadline: string;
  platforms: BountyPlatform[];
  about: string;
  requirements: string[];
  status: BountyStatus;
};

export const BOUNTIES: Bounty[] = [
  {
    id: "harbor-morning",
    title: "Harbor morning recap",
    brand: "Harbor Media",
    action: "Recap",
    rewardCents: 8000,
    spotsLeft: 6,
    deadline: "2026-12-12",
    platforms: ["instagram", "tiktok"],
    about: "A 20–40 second recap of a quiet harbor morning. The cup should be in frame before the first cut.",
    requirements: [
      "20–40 seconds, vertical.",
      "Show the cup in the first 3 seconds.",
      "No competing drink brands in frame.",
      "Post from an account you control.",
    ],
    status: "open",
  },
  {
    id: "northwind-pour",
    title: "Northwind pour",
    brand: "Northwind",
    action: "Pour",
    rewardCents: 6000,
    spotsLeft: 8,
    deadline: "2026-12-08",
    platforms: ["instagram", "youtube"],
    about: "One clean pour of the autumn roast. Keep the sound of the pour and end on the cup.",
    requirements: [
      "15–30 seconds.",
      "The bag or cup label stays readable.",
      "No voiceover over the pour.",
      "One post per account.",
    ],
    status: "open",
  },
  {
    id: "fieldday-highlight",
    title: "Fieldday highlight",
    brand: "InHouse Media",
    action: "Highlight",
    rewardCents: 12000,
    spotsLeft: 4,
    deadline: "2026-12-18",
    platforms: ["tiktok", "youtube"],
    about: "A single play, cut tight. Start on the move and end before the celebration runs long.",
    requirements: [
      "12–25 seconds.",
      "No broadcast watermark.",
      "Keep the original crowd sound.",
      "Do not add a betting overlay.",
    ],
    status: "open",
  },
  {
    id: "lumen-unbox",
    title: "Lumen unbox",
    brand: "Lumen Labs",
    action: "Unbox",
    rewardCents: 9000,
    spotsLeft: 5,
    deadline: "2026-12-15",
    platforms: ["instagram", "x"],
    about: "Open the lamp, turn it on, and show the light on a desk. The logo faces the camera once.",
    requirements: [
      "25–45 seconds.",
      "Logo readable for at least a second.",
      "Desk stays uncluttered.",
      "No price or discount mentioned.",
    ],
    status: "open",
  },
  {
    id: "copper-table",
    title: "Copper table",
    brand: "Copper",
    action: "Table",
    rewardCents: 5000,
    spotsLeft: 10,
    deadline: "2026-12-20",
    platforms: ["instagram"],
    about: "A short table scene: plate down, one bite, pull back to the room.",
    requirements: [
      "15–35 seconds.",
      "The plate mark is visible.",
      "Natural room light only.",
      "No other restaurant names.",
    ],
    status: "open",
  },
  {
    id: "summit-ridge",
    title: "Summit ridge",
    brand: "Summit",
    action: "Walk",
    rewardCents: 15000,
    spotsLeft: 3,
    deadline: "2026-12-05",
    platforms: ["tiktok", "youtube"],
    about: "A ridge walk in one continuous feel. The jacket is on for the whole clip.",
    requirements: [
      "20–40 seconds.",
      "Jacket logo visible outdoors.",
      "No drone footage.",
      "No trail names that belong to another brand.",
    ],
    status: "open",
  },
];

export function listBounties(): Bounty[] {
  return BOUNTIES;
}

export function getBounty(id: string): Bounty | null {
  return BOUNTIES.find((bounty) => bounty.id === id) ?? null;
}

export function bountyReward(cents: number): string {
  return formatCents(cents);
}

export function bountyPlatformLabel(platform: BountyPlatform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "tiktok") return "TikTok";
  if (platform === "youtube") return "YouTube";
  return "X";
}

export function bountyDeadline(deadline: string): string {
  const [year, month, day] = deadline.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" }).format(date);
}

export function bountyStatusLabel(status: BountyStatus): string {
  return status === "open" ? "Open" : "Closed";
}
