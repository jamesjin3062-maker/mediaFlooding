"use client";

import Link from "next/link";
import { ChevronRight, Search } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { campaignInitials } from "@/lib/campaign-mark";
import { calm, platformTone } from "@/lib/calm-color";
import { accountStatusNote, canSubmitAccount, type AccountList, type PostingAccount } from "@/lib/clipstake-accounts";
import { platformLabel } from "@/lib/clipstake";
import { cn } from "@/lib/utils";

const th = "border-b bg-muted/30 px-4 py-3 text-left text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground first:pl-5 last:pr-5";
const td = "border-b px-4 py-4 align-middle group-last:border-b-0 first:pl-5 last:pr-5";

const TYPE_FILTERS = [
  { id: "", label: "All" },
  { id: "instagram", label: "Instagram" },
  { id: "x", label: "X" },
] as const;

const ORDER_FILTERS = [
  { id: "az", label: "A–Z" },
  { id: "za", label: "Z–A" },
] as const;

function formatFollowers(count: number | null): string | null {
  if (count === null) return null;
  return new Intl.NumberFormat("en", { notation: "compact" }).format(count);
}

export function AccountsBoard() {
  const [platform, setPlatform] = useState("");
  const [order, setOrder] = useState<"az" | "za">("az");
  const [query, setQuery] = useState("");
  const [list, setList] = useState<AccountList | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setList(null);
    const query = platform ? `?platform=${platform}` : "";
    void fetch(`/api/accounts${query}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load accounts.");
        return response.json() as Promise<AccountList>;
      })
      .then((body) => {
        if (!cancelled) setList(body);
      })
      .catch((loadError: Error) => {
        if (!cancelled) setError(loadError.message);
      });
    return () => {
      cancelled = true;
    };
  }, [platform]);

  async function loadMore() {
    if (!list?.next_cursor) return;
    const params = new URLSearchParams({ cursor: list.next_cursor });
    if (platform) params.set("platform", platform);
    const response = await fetch(`/api/accounts?${params}`);
    if (!response.ok) return;
    const page = await response.json() as AccountList;
    setList({ ...page, data: [...list.data, ...page.data] });
  }

  const sorted = useMemo(() => {
    const rows = [...(list?.data ?? [])];
    rows.sort((a, b) => a.handle.localeCompare(b.handle, undefined, { sensitivity: "base" }));
    if (order === "za") rows.reverse();
    return rows;
  }, [list, order]);
  const accounts = useMemo(() => {
    const needle = query.trim().replace(/^@/, "").toLowerCase();
    if (!needle) return sorted;
    return sorted.filter((account) => {
      const haystack = `${account.handle} ${platformLabel(account.platform)} ${account.status.replaceAll("_", " ")}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [sorted, query]);
  const readyCount = sorted.filter((account) => canSubmitAccount(account)).length;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 md:py-12">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className={cn("text-xs font-semibold uppercase tracking-[0.18em]", calm.mist.text)}>Clipstake</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">Accounts</h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Profiles that post your clips. A profile has to be connected before it can submit.
          </p>
        </div>
        <dl className="grid grid-cols-3 gap-2 sm:gap-3">
          <Stat label="Profiles" value={list ? String(sorted.length) : "—"} />
          <Stat label="Ready" value={list ? String(readyCount) : "—"} />
          <Stat label="Needs care" value={list ? String(sorted.length - readyCount) : "—"} />
        </dl>
      </header>

      {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}
      {list?.notice ? <p className="mt-4 text-xs text-muted-foreground">{list.notice}</p> : null}

      <section className="mt-8 overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search handles"
                aria-label="Search accounts"
                className="h-8 rounded-full bg-background pl-9"
              />
            </div>
            <p className="text-sm font-medium">{list ? `${accounts.length} shown` : "Loading profiles"}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <FilterGroup label="Type">
              {TYPE_FILTERS.map((filter) => (
                <FilterButton key={filter.id || "all"} pressed={platform === filter.id} onClick={() => setPlatform(filter.id)}>
                  {filter.label}
                </FilterButton>
              ))}
            </FilterGroup>
            <FilterGroup label="Order">
              {ORDER_FILTERS.map((filter) => (
                <FilterButton key={filter.id} pressed={order === filter.id} onClick={() => setOrder(filter.id)}>
                  {filter.label}
                </FilterButton>
              ))}
            </FilterGroup>
          </div>
        </div>

        {!list && !error ? <AccountTableSkeleton /> : null}
        {list && sorted.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center gap-1 px-6 text-center">
            <p className="font-display text-lg font-semibold">No profiles yet</p>
            <p className="max-w-sm text-sm text-muted-foreground">Connect an Instagram or X profile in Clipstake, then it will show up here.</p>
          </div>
        ) : null}
        {list && sorted.length > 0 && accounts.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center gap-1 px-6 text-center">
            <p className="font-display text-lg font-semibold">No matching profiles</p>
            <p className="max-w-sm text-sm text-muted-foreground">Try another handle, or clear the search.</p>
          </div>
        ) : null}

        {accounts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-separate border-spacing-0 text-sm">
              <caption className="sr-only">Connected accounts</caption>
              <thead>
                <tr>
                  <th className={cn(th, "w-14")}>#</th>
                  <th className={th}>Account</th>
                  <th className={th}>Platform</th>
                  <th className={th}>Status</th>
                  <th className={cn(th, "text-right")}>Followers</th>
                  <th className={th}>Viewer countries</th>
                  <th className={th}>Note</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account, index) => <AccountRow key={account.id} account={account} index={index + 1} />)}
              </tbody>
            </table>
          </div>
        ) : null}

        {list?.next_cursor ? (
          <div className="flex justify-center border-t px-4 py-3">
            <Button type="button" variant="ghost" onClick={() => void loadMore()}>
              Load more
            </Button>
          </div>
        ) : null}
      </section>
    </main>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={label}>
      <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function FilterButton({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors",
        pressed ? "border-foreground bg-foreground text-background" : "bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card px-4 py-3 shadow-sm">
      <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-display text-2xl font-bold tabular-nums tracking-tight">{value}</dd>
    </div>
  );
}

function AccountTableSkeleton() {
  return (
    <div className="space-y-px px-5 py-4">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 border-b py-4 last:border-b-0">
          <Skeleton className="size-10 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

function statusLabel(status: string): string {
  const label = status.replaceAll("_", " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function viewerCountries(account: PostingAccount): { label: string; tone: string } | null {
  if (account.viewer_locations_available === true) return { label: "On file", tone: calm.sage.surface };
  if (account.viewer_locations_available === false) return { label: "Missing", tone: calm.sand.surface };
  return null;
}

function AccountMark({ account }: { account: PostingAccount }) {
  return (
    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl font-display text-sm font-bold", platformTone(account.platform))}>
      {campaignInitials(account.handle)}
    </span>
  );
}

function AccountRow({ account, index }: { account: PostingAccount; index: number }) {
  const note = accountStatusNote(account);
  const followers = formatFollowers(account.followers_count);
  const ready = canSubmitAccount(account);
  const countries = viewerCountries(account);
  return (
    <tr className="group transition-colors hover:bg-[oklch(0.97_0.012_235)] dark:hover:bg-[oklch(0.24_0.015_235)]">
      <td className={cn(td, "w-14 tabular-nums text-muted-foreground")}>{index}</td>
      <td className={td}>
        <Link href={`/accounts/${account.id}`} className="flex w-full items-center gap-3">
          <AccountMark account={account} />
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-semibold tracking-tight group-hover:underline">@{account.handle}</span>
          </span>
          <ChevronRight className="ml-auto size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      </td>
      <td className={td}>
        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", platformTone(account.platform))}>
          {platformLabel(account.platform)}
        </span>
      </td>
      <td className={td}>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", ready ? calm.sage.surface : calm.sand.surface)}>
          <span className={cn("size-1.5 rounded-full", ready ? calm.sage.dot : calm.sand.dot)} />
          {statusLabel(account.status)}
        </span>
      </td>
      <td className={cn(td, "text-right font-display text-base font-semibold tabular-nums")}>
        {followers ?? <span className="font-sans text-sm font-normal text-muted-foreground">—</span>}
      </td>
      <td className={td}>
        {countries ? (
          <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", countries.tone)}>{countries.label}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </td>
      <td className={cn(td, "max-w-xs text-xs leading-5")}>
        <span className={cn("line-clamp-2", note ? "text-muted-foreground" : calm.sage.text)}>{note ?? "Ready to submit"}</span>
      </td>
    </tr>
  );
}
