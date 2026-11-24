import { CLIPSTAKE_API_BASE_URL, clipstakeRequestInit, readClipstakeCache } from "@/lib/clipstake";

export type PostingAccount = {
  id: string;
  platform: string;
  handle: string;
  status: string;
  followers_count: number | null;
  viewer_locations_available: boolean | null;
  connected_at: string;
};

export type AccountList = {
  source: "clipstake" | "sample";
  notice: string | null;
  data: PostingAccount[];
  next_cursor: string | null;
};

export type InstagramPost = {
  media_id: string;
  permalink: string | null;
  caption: string | null;
  thumbnail_url: string | null;
  posted_at: string | null;
  like_count: number;
  comments_count: number;
  submitted: boolean;
};

export type MediaError = {
  status: number;
  message: string;
  retry_after: number | null;
  request_id: string | null;
};

export type MediaList = {
  source: "clipstake" | "sample";
  data: InstagramPost[];
  next_cursor: string | null;
  error: MediaError | null;
};

function accountId(index: number): string {
  return `acct_${index.toString(16).padStart(32, "0")}`;
}

export const SAMPLE_ACCOUNTS: PostingAccount[] = [
  {
    id: accountId(1),
    platform: "instagram",
    handle: "northwind.reels",
    status: "connected",
    followers_count: 12800,
    viewer_locations_available: true,
    connected_at: "2026-09-02T10:15:00.000Z",
  },
  {
    id: accountId(2),
    platform: "x",
    handle: "northwind",
    status: "connected",
    followers_count: null,
    viewer_locations_available: null,
    connected_at: "2026-08-28T12:00:00.000Z",
  },
  {
    id: accountId(3),
    platform: "instagram",
    handle: "harbor.clips",
    status: "reconnect_needed",
    followers_count: 4200,
    viewer_locations_available: false,
    connected_at: "2026-08-12T09:00:00.000Z",
  },
  {
    id: accountId(4),
    platform: "instagram",
    handle: "pulse.reels",
    status: "security_check",
    followers_count: 900,
    viewer_locations_available: false,
    connected_at: "2026-07-30T15:40:00.000Z",
  },
];

export const SAMPLE_MEDIA: Record<string, InstagramPost[]> = {
  [accountId(1)]: [
    {
      media_id: "17912345678901234",
      permalink: "https://www.instagram.com/reel/C9xYz12AbCd/",
      caption: "Autumn roast, first sip.",
      thumbnail_url: null,
      posted_at: "2026-09-18T17:05:00.000Z",
      like_count: 2600,
      comments_count: 140,
      submitted: true,
    },
    {
      media_id: "17923456789012345",
      permalink: "https://www.instagram.com/reel/C9zAb34CdEf/",
      caption: "Grinding the new roast.",
      thumbnail_url: null,
      posted_at: "2026-09-19T09:40:00.000Z",
      like_count: 310,
      comments_count: 12,
      submitted: false,
    },
  ],
};

export function canSubmitAccount(account: Pick<PostingAccount, "platform" | "status">): boolean {
  return account.status === "connected" && (account.platform === "instagram" || account.platform === "x");
}

export function accountStatusNote(account: Pick<PostingAccount, "platform" | "status" | "viewer_locations_available">): string | null {
  if (account.platform !== "instagram" && account.platform !== "x") {
    return "This platform cannot submit a clip yet.";
  }
  if (account.status === "reconnect_needed") {
    return "Connect this profile again in Clipstake. Submit stays off until it is connected.";
  }
  if (account.status === "security_check") {
    return "Log in at instagram.com and pass Instagram’s security check. Submit stays off until that is done.";
  }
  if (account.status !== "connected") {
    return "This account cannot submit until its status is connected.";
  }
  if (account.platform === "instagram" && account.viewer_locations_available === false) {
    return "Instagram has not reported viewer countries. A campaign that pays by country will refuse clips from this account.";
  }
  return null;
}

function asAccount(value: unknown): PostingAccount | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.platform !== "string" || typeof row.handle !== "string" || typeof row.status !== "string") return null;
  return {
    id: row.id,
    platform: row.platform,
    handle: row.handle,
    status: row.status,
    followers_count: typeof row.followers_count === "number" ? row.followers_count : null,
    viewer_locations_available: typeof row.viewer_locations_available === "boolean" ? row.viewer_locations_available : null,
    connected_at: typeof row.connected_at === "string" ? row.connected_at : "",
  };
}

export function parseAccountList(payload: unknown): PostingAccount[] {
  const data = payload && typeof payload === "object" && "data" in payload ? (payload as { data: unknown }).data : payload;
  if (!Array.isArray(data)) return [];
  return data.flatMap((item) => {
    const account = asAccount(item);
    return account ? [account] : [];
  });
}

function asPost(value: unknown): InstagramPost | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  if (typeof row.media_id !== "string") return null;
  return {
    media_id: row.media_id,
    permalink: typeof row.permalink === "string" ? row.permalink : null,
    caption: typeof row.caption === "string" ? row.caption : null,
    thumbnail_url: typeof row.thumbnail_url === "string" ? row.thumbnail_url : null,
    posted_at: typeof row.posted_at === "string" ? row.posted_at : null,
    like_count: typeof row.like_count === "number" ? row.like_count : 0,
    comments_count: typeof row.comments_count === "number" ? row.comments_count : 0,
    submitted: row.submitted === true,
  };
}

export function parseMediaList(payload: unknown): InstagramPost[] {
  const data = payload && typeof payload === "object" && "data" in payload ? (payload as { data: unknown }).data : payload;
  if (!Array.isArray(data)) return [];
  return data.flatMap((item) => {
    const post = asPost(item);
    return post ? [post] : [];
  });
}

function cursorOf(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const cursor = (payload as { next_cursor?: unknown }).next_cursor;
  return typeof cursor === "string" ? cursor : null;
}

function authHeaders(): HeadersInit | null {
  const key = process.env.CLIPSTAKE_API_KEY?.trim();
  if (!key) return null;
  return { Authorization: `Bearer ${key}`, Accept: "application/json" };
}

function accountsUrl(): string {
  return (process.env.CLIPSTAKE_LIST_ACCOUNTS_URL || `${CLIPSTAKE_API_BASE_URL}/accounts`).replace(/\/$/, "");
}

function mediaUrl(id: string): string {
  const base = (process.env.CLIPSTAKE_ACCOUNT_MEDIA_URL || `${CLIPSTAKE_API_BASE_URL}/accounts`).replace(/\/$/, "");
  return `${base}/${encodeURIComponent(id)}/media`;
}

function errorBody(payload: unknown, status: number, retryAfter: number | null): MediaError {
  const error = payload && typeof payload === "object" ? (payload as { error?: { message?: unknown; request_id?: unknown } }).error : undefined;
  return {
    status,
    message: typeof error?.message === "string" ? error.message : "Could not load posts for this account.",
    retry_after: retryAfter,
    request_id: typeof error?.request_id === "string" ? error.request_id : null,
  };
}

export async function listAccounts(options: { platform?: string | null; cursor?: string | null } = {}): Promise<AccountList> {
  const platform = options.platform === "instagram" || options.platform === "x" ? options.platform : null;
  const sample = platform ? SAMPLE_ACCOUNTS.filter((account) => account.platform === platform) : SAMPLE_ACCOUNTS;
  const headers = authHeaders();
  if (!headers) return { source: "sample", notice: null, data: sample, next_cursor: null };

  const cursor = options.cursor?.trim() || "";
  const key = `accounts:${platform ?? "all"}:${cursor}`;
  return readClipstakeCache(key, () => loadAccounts(headers, platform, cursor, sample), (list) => list.source === "clipstake");
}

async function loadAccounts(
  headers: HeadersInit,
  platform: "instagram" | "x" | null,
  cursor: string,
  sample: PostingAccount[],
): Promise<AccountList> {
  const url = new URL(accountsUrl());
  url.searchParams.set("limit", "100");
  if (platform) url.searchParams.set("platform", platform);
  if (cursor) url.searchParams.set("cursor", cursor);

  try {
    const response = await fetch(url, clipstakeRequestInit(headers));
    if (!response.ok) {
      return { source: "sample", notice: "Clipstake did not return accounts, so this list is a sample.", data: sample, next_cursor: null };
    }
    const payload = await response.json();
    return { source: "clipstake", notice: null, data: parseAccountList(payload), next_cursor: cursorOf(payload) };
  } catch {
    return { source: "sample", notice: "Clipstake could not be reached, so this list is a sample.", data: sample, next_cursor: null };
  }
}

export async function listAccountMedia(id: string, cursor?: string | null): Promise<MediaList> {
  const samplePosts = SAMPLE_MEDIA[id] ?? [];
  const headers = authHeaders();
  if (!headers) return { source: "sample", data: samplePosts, next_cursor: null, error: null };

  const url = new URL(mediaUrl(id));
  url.searchParams.set("limit", "25");
  if (cursor) url.searchParams.set("cursor", cursor);

  try {
    const response = await fetch(url, clipstakeRequestInit(headers));
    if (response.ok) {
      const payload = await response.json();
      return { source: "clipstake", data: parseMediaList(payload), next_cursor: cursorOf(payload), error: null };
    }
    const payload = await response.json().catch(() => null);
    const retryHeader = response.headers.get("retry-after");
    const retryAfter = retryHeader && Number.isFinite(Number(retryHeader)) ? Number(retryHeader) : null;
    return { source: "clipstake", data: [], next_cursor: null, error: errorBody(payload, response.status, retryAfter) };
  } catch {
    return {
      source: "clipstake",
      data: [],
      next_cursor: null,
      error: { status: 503, message: "Could not load the posts of this account. Try again in a few minutes.", retry_after: null, request_id: null },
    };
  }
}
