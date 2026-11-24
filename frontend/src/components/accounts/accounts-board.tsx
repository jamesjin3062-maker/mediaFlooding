"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { accountStatusNote, canSubmitAccount, type AccountList, type PostingAccount } from "@/lib/clipstake-accounts";
import { platformLabel } from "@/lib/clipstake";
import { cn } from "@/lib/utils";

const FILTERS = [
  { id: "", label: "All" },
  { id: "instagram", label: "Instagram" },
  { id: "x", label: "X" },
] as const;

function formatFollowers(count: number | null): string | null {
  if (count === null) return null;
  return new Intl.NumberFormat("en", { notation: "compact" }).format(count);
}

export function AccountsBoard() {
  const [platform, setPlatform] = useState("");
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

  const accounts = list?.data ?? [];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 md:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="mt-1 text-sm text-muted-foreground">{accounts.length} connected</p>
        </div>
        <div className="flex gap-1.5" role="tablist" aria-label="Platform">
          {FILTERS.map((filter) => (
            <button
              key={filter.id || "all"}
              type="button"
              role="tab"
              aria-selected={platform === filter.id}
              onClick={() => setPlatform(filter.id)}
              className={cn(
                "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors",
                platform === filter.id ? "border-foreground bg-foreground text-background" : "bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}
      {!list && !error ? <p className="mt-4 text-sm text-muted-foreground">Loading accounts…</p> : null}
      {list && accounts.length === 0 ? (
        <div className="mt-4 flex h-28 items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">
          No profiles are connected to this Clipstake user yet.
        </div>
      ) : null}

      <ul className="mt-4 space-y-3">
        {accounts.map((account) => <AccountRow key={account.id} account={account} />)}
      </ul>
      {list?.next_cursor ? (
        <Button type="button" variant="outline" onClick={() => void loadMore()} className="mt-4">
          Load more
        </Button>
      ) : null}
      {list?.notice ? <p className="mt-4 text-xs text-muted-foreground">{list.notice}</p> : null}
    </main>
  );
}

function AccountRow({ account }: { account: PostingAccount }) {
  const note = accountStatusNote(account);
  const followers = formatFollowers(account.followers_count);
  const ready = canSubmitAccount(account);
  return (
    <li>
      <Link href={`/accounts/${account.id}`} className="block rounded-xl border bg-card px-4 py-3 text-card-foreground shadow-sm transition-colors hover:border-foreground/20">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">@{account.handle}</p>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">{platformLabel(account.platform)}</p>
          </div>
          <span className={cn(
            "rounded-full px-2 py-0.5 text-xs",
            ready ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-800 dark:text-amber-300",
          )}>
            {account.status.replaceAll("_", " ")}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {followers ? `${followers} followers` : "Followers not available"}
          {account.viewer_locations_available === true ? " · viewer countries on file" : ""}
          {account.viewer_locations_available === false ? " · no viewer countries" : ""}
        </p>
        {note ? <p className="mt-2 text-xs leading-5 text-muted-foreground">{note}</p> : null}
      </Link>
    </li>
  );
}
