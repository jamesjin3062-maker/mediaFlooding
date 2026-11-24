export const CLIPSTAKE_API_BASE_URL = "https://app.clipstake.com/api/v1/creator";

export type CampaignStatus = "pending_payment" | "ready_to_launch" | "active" | "paused" | "ended";

export type CampaignPlatform = {
  platform: string;
  cpm_cents: number | null;
};

export type GeoRate = {
  kind: "include" | "exclude";
  cpm_cents: number | null;
  countries: string[];
};

export type Campaign = {
  id: string;
  name: string;
  slug: string;
  brand_name: string;
  status: CampaignStatus;
  about: string;
  instructions: string;
  invite_only: boolean;
  invite_accepted: boolean;
  platforms: CampaignPlatform[];
  geo_enabled: boolean;
  geo_rates: GeoRate[];
  max_payout_per_clip_cents: number;
  platform_fee_bps: number;
  max_clips: number;
  clip_count: number;
  start_date: string;
  end_date: string | null;
  launched_at: string | null;
  posted_after_launch_only: boolean;
  submission_window_hours: number | null;
  banner: string;
  logo: string;
};

export type CampaignList = {
  source: "clipstake" | "sample";
  notice: string | null;
  data: Campaign[];
  next_cursor: string | null;
};

export type CampaignMembership = "open" | "apply" | "pending" | "closed";

const SAMPLE_ART = [
  ["northwind", "#d6ff3f", "#111111"],
  ["harbor", "#ff2d2d", "#1a1a1a"],
  ["pulse", "#1f8a3b", "#0c1a10"],
  ["vesper", "#ff8a00", "#2a1200"],
  ["fieldday", "#123c9c", "#f4f4f4"],
  ["lumen", "#39ff88", "#06210f"],
  ["copper", "#e10600", "#140000"],
  ["summit", "#7dff3a", "#071407"],
  ["relay", "#f5f5f5", "#111111"],
  ["crown", "#7a3cff", "#12081f"],
] as const;

function sampleCampaign(
  index: number,
  fields: Pick<Campaign, "name" | "brand_name" | "status" | "invite_only" | "invite_accepted" | "about" | "platforms">,
): Campaign {
  const [slug, ,] = SAMPLE_ART[index];
  const id = `cmp_${(index + 1).toString(16).padStart(32, "0")}`;
  return {
    id,
    slug,
    instructions: "Post the clip on an accepted platform, then submit the post link.",
    geo_enabled: false,
    geo_rates: [],
    max_payout_per_clip_cents: 25000,
    platform_fee_bps: 1500,
    max_clips: 20,
    clip_count: 0,
    start_date: "2026-09-01T00:00:00.000Z",
    end_date: null,
    launched_at: fields.status === "active" ? "2026-09-01T00:00:00.000Z" : null,
    posted_after_launch_only: false,
    submission_window_hours: null,
    banner: `/campaigns/${slug}-banner.svg`,
    logo: `/campaigns/${slug}-logo.svg`,
    ...fields,
  };
}

/** Shown until Clipstake returns campaigns for this account. */
export const SAMPLE_CAMPAIGNS: Campaign[] = [
  sampleCampaign(0, { name: "Northwind", brand_name: "Northwind", status: "paused", invite_only: false, invite_accepted: false, about: "Coffee clips for the autumn roast.", platforms: [{ platform: "instagram", cpm_cents: 100 }] }),
  sampleCampaign(1, { name: "Harbor", brand_name: "Harbor Media", status: "ready_to_launch", invite_only: true, invite_accepted: false, about: "Launch clips for Harbor.", platforms: [{ platform: "instagram", cpm_cents: 150 }] }),
  sampleCampaign(2, { name: "Pulse", brand_name: "Pulse Studio", status: "pending_payment", invite_only: true, invite_accepted: false, about: "Short posts from live shows.", platforms: [{ platform: "x", cpm_cents: 80 }] }),
  sampleCampaign(3, { name: "Vesper", brand_name: "Vesper", status: "paused", invite_only: true, invite_accepted: false, about: "UGC clips for Vesper.", platforms: [{ platform: "instagram", cpm_cents: 120 }] }),
  sampleCampaign(4, { name: "Fieldday", brand_name: "InHouse Media", status: "paused", invite_only: true, invite_accepted: false, about: "Sports-style highlight clips.", platforms: [{ platform: "instagram", cpm_cents: 200 }] }),
  sampleCampaign(5, { name: "Lumen", brand_name: "Lumen Labs", status: "ready_to_launch", invite_only: true, invite_accepted: true, about: "Product clips with the logo in frame.", platforms: [{ platform: "x", cpm_cents: 90 }] }),
  sampleCampaign(6, { name: "Copper", brand_name: "Copper", status: "paused", invite_only: true, invite_accepted: false, about: "Table and lifestyle clips.", platforms: [{ platform: "instagram", cpm_cents: 110 }] }),
  sampleCampaign(7, { name: "Summit", brand_name: "Summit", status: "ended", invite_only: false, invite_accepted: false, about: "Outdoor brand clips.", platforms: [{ platform: "instagram", cpm_cents: 140 }] }),
  sampleCampaign(8, { name: "Relay", brand_name: "Relay", status: "paused", invite_only: true, invite_accepted: false, about: "App walkthrough clips.", platforms: [{ platform: "x", cpm_cents: 70 }] }),
  sampleCampaign(9, { name: "Crown Cut", brand_name: "Rips", status: "paused", invite_only: true, invite_accepted: false, about: "Night-life recap clips.", platforms: [{ platform: "instagram", cpm_cents: 160 }] }),
];

export function campaignMembership(campaign: Pick<Campaign, "status" | "invite_only" | "invite_accepted">): CampaignMembership {
  if (campaign.status === "active" && (!campaign.invite_only || campaign.invite_accepted)) return "open";
  if (campaign.status === "pending_payment" || campaign.status === "ready_to_launch") return "pending";
  if (campaign.invite_only && !campaign.invite_accepted) return "apply";
  return "closed";
}

export function membershipLabel(membership: CampaignMembership): string {
  if (membership === "open") return "Open";
  if (membership === "apply") return "Apply to join";
  if (membership === "pending") return "Application pending";
  return "No active campaigns";
}

function asGeoRates(value: unknown): GeoRate[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as Record<string, unknown>;
    if (row.kind !== "include" && row.kind !== "exclude") return [];
    const countries = Array.isArray(row.countries)
      ? row.countries.flatMap((code) => (typeof code === "string" && code.trim() ? [code.trim()] : []))
      : [];
    return [{
      kind: row.kind,
      cpm_cents: typeof row.cpm_cents === "number" ? row.cpm_cents : null,
      countries,
    }];
  });
}

export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const absolute = Math.abs(Math.trunc(cents));
  return `${sign}$${Math.floor(absolute / 100)}.${(absolute % 100).toString().padStart(2, "0")}`;
}

export function geoRateLabel(rate: GeoRate): string {
  const countries = rate.countries.join(", ") || "Other countries";
  if (rate.kind === "exclude") return `No pay for views from ${countries}`;
  const pay = rate.cpm_cents == null ? "Country rate" : `${formatCents(rate.cpm_cents)} per 1,000 views`;
  return `${countries}: ${pay}`;
}

export function postingRule(campaign: Pick<Campaign, "posted_after_launch_only" | "submission_window_hours">): string | null {
  if (typeof campaign.submission_window_hours === "number") {
    const hours = campaign.submission_window_hours;
    return `Only posts from the first ${hours} ${hours === 1 ? "hour" : "hours"} after launch`;
  }
  if (campaign.posted_after_launch_only) return "Only posts published after the campaign launched";
  return null;
}

function artFor(id: string): { banner: string; logo: string } {
  const index = SAMPLE_CAMPAIGNS.findIndex((campaign) => campaign.id === id);
  const slug = SAMPLE_ART[(index >= 0 ? index : id.length) % SAMPLE_ART.length][0];
  return { banner: `/campaigns/${slug}-banner.svg`, logo: `/campaigns/${slug}-logo.svg` };
}

function asCampaign(value: unknown): Campaign | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.name !== "string" || typeof row.brand_name !== "string") return null;
  const status = row.status;
  if (status !== "pending_payment" && status !== "ready_to_launch" && status !== "active" && status !== "paused" && status !== "ended") return null;
  const platforms = Array.isArray(row.platforms)
    ? row.platforms.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const platform = item as Record<string, unknown>;
        if (typeof platform.platform !== "string") return [];
        return [{ platform: platform.platform, cpm_cents: typeof platform.cpm_cents === "number" ? platform.cpm_cents : null }];
      })
    : [];
  const art = artFor(row.id);
  return {
    id: row.id,
    name: row.name,
    slug: typeof row.slug === "string" ? row.slug : row.id,
    brand_name: row.brand_name,
    status,
    about: typeof row.about === "string" ? row.about : "",
    instructions: typeof row.instructions === "string" ? row.instructions : "",
    invite_only: row.invite_only === true,
    invite_accepted: row.invite_accepted === true,
    platforms,
    geo_enabled: row.geo_enabled === true,
    geo_rates: asGeoRates(row.geo_rates),
    max_payout_per_clip_cents: typeof row.max_payout_per_clip_cents === "number" ? row.max_payout_per_clip_cents : 0,
    platform_fee_bps: typeof row.platform_fee_bps === "number" ? row.platform_fee_bps : 0,
    max_clips: typeof row.max_clips === "number" ? row.max_clips : 0,
    clip_count: typeof row.clip_count === "number" ? row.clip_count : 0,
    start_date: typeof row.start_date === "string" ? row.start_date : "",
    end_date: typeof row.end_date === "string" ? row.end_date : null,
    launched_at: typeof row.launched_at === "string" ? row.launched_at : null,
    posted_after_launch_only: row.posted_after_launch_only === true,
    submission_window_hours: typeof row.submission_window_hours === "number" ? row.submission_window_hours : null,
    banner: typeof row.banner === "string" ? row.banner : art.banner,
    logo: typeof row.logo === "string" ? row.logo : art.logo,
  };
}

export function parseCampaignList(payload: unknown): Campaign[] {
  const data = payload && typeof payload === "object" && "data" in payload ? (payload as { data: unknown }).data : payload;
  if (!Array.isArray(data)) return [];
  return data.flatMap((item) => {
    const campaign = asCampaign(item);
    return campaign ? [campaign] : [];
  });
}

export function parseCampaign(payload: unknown): Campaign | null {
  return asCampaign(payload);
}

function listUrl(): string {
  return (process.env.CLIPSTAKE_LIST_CAMPAIGNS_URL || `${CLIPSTAKE_API_BASE_URL}/campaigns`).replace(/\/$/, "");
}

function campaignUrl(id: string): string {
  const base = (process.env.CLIPSTAKE_GET_CAMPAIGN_URL || `${CLIPSTAKE_API_BASE_URL}/campaigns`).replace(/\/$/, "");
  return `${base}/${encodeURIComponent(id)}`;
}

function authHeaders(): HeadersInit | null {
  const key = process.env.CLIPSTAKE_API_KEY?.trim();
  if (!key) return null;
  return { Authorization: `Bearer ${key}`, Accept: "application/json" };
}

const CLIPSTAKE_CACHE_MS = 60_000;
const CLIPSTAKE_TIMEOUT_MS = 8_000;

type CacheEntry = { expires: number; value: unknown };
const clipstakeCache = new Map<string, CacheEntry>();
const clipstakeInflight = new Map<string, Promise<unknown>>();

/** Reuse a successful Clipstake response for a minute, and share one in-flight request. */
export function readClipstakeCache<T>(key: string, load: () => Promise<T>, keep: (value: T) => boolean): Promise<T> {
  const hit = clipstakeCache.get(key);
  if (hit && hit.expires > Date.now()) return Promise.resolve(hit.value as T);
  const running = clipstakeInflight.get(key) as Promise<T> | undefined;
  if (running) return running;
  const promise = load()
    .then((value) => {
      if (keep(value)) clipstakeCache.set(key, { expires: Date.now() + CLIPSTAKE_CACHE_MS, value });
      return value;
    })
    .finally(() => {
      if (clipstakeInflight.get(key) === promise) clipstakeInflight.delete(key);
    });
  clipstakeInflight.set(key, promise);
  return promise;
}

export function clipstakeRequestInit(headers: HeadersInit): RequestInit {
  return { headers, cache: "no-store", signal: AbortSignal.timeout(CLIPSTAKE_TIMEOUT_MS) };
}

export async function listCampaigns(): Promise<CampaignList> {
  const headers = authHeaders();
  if (!headers) {
    return { source: "sample", notice: null, data: SAMPLE_CAMPAIGNS, next_cursor: null };
  }
  return readClipstakeCache("campaigns", () => loadCampaigns(headers), (list) => list.source === "clipstake");
}

async function loadCampaigns(headers: HeadersInit): Promise<CampaignList> {
  try {
    const response = await fetch(`${listUrl()}?limit=100`, clipstakeRequestInit(headers));
    if (!response.ok) {
      return { source: "sample", notice: "Clipstake did not return campaigns, so this list is a sample.", data: SAMPLE_CAMPAIGNS, next_cursor: null };
    }
    const payload = await response.json();
    const next = payload && typeof payload === "object" ? (payload as { next_cursor?: unknown }).next_cursor : null;
    return {
      source: "clipstake",
      notice: null,
      data: parseCampaignList(payload),
      next_cursor: typeof next === "string" ? next : null,
    };
  } catch {
    return { source: "sample", notice: "Clipstake could not be reached, so this list is a sample.", data: SAMPLE_CAMPAIGNS, next_cursor: null };
  }
}

export async function getCampaign(id: string): Promise<{ source: "clipstake" | "sample"; campaign: Campaign | null }> {
  const sample = SAMPLE_CAMPAIGNS.find((campaign) => campaign.id === id) ?? null;
  const headers = authHeaders();
  if (!headers) return { source: "sample", campaign: sample };
  return readClipstakeCache(`campaign:${id}`, () => loadCampaign(id, headers, sample), (result) => result.source === "clipstake");
}

async function loadCampaign(
  id: string,
  headers: HeadersInit,
  sample: Campaign | null,
): Promise<{ source: "clipstake" | "sample"; campaign: Campaign | null }> {
  try {
    const response = await fetch(campaignUrl(id), clipstakeRequestInit(headers));
    if (response.status === 404) return { source: "clipstake", campaign: null };
    if (!response.ok) return { source: "sample", campaign: sample };
    return { source: "clipstake", campaign: parseCampaign(await response.json()) };
  } catch {
    return { source: "sample", campaign: sample };
  }
}
