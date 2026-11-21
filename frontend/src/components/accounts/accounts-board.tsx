"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { accountStatusNote, canSubmitAccount, type AccountList, type PostingAccount } from "@/lib/clipstake-accounts";
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
    <main className="min-h-full bg-[#0c0c0c] px-4 py-6 text-white sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="flex items-center gap-2 text-base font-semibold">
          Accounts
          <span className="text-sm font-medium text-white/45">{accounts.length}</span>
        </h1>
        <div className="flex gap-1 rounded-lg border border-white/10 p-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.id || "all"}
              type="button"
              onClick={() => setPlatform(filter.id)}
              className={cn("rounded-md px-3 py-1 text-sm", platform === filter.id ? "bg-white text-black" : "text-white/60 hover:text-white")}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      {!list && !error ? <p className="mt-4 text-sm text-white/45">Loading accounts…</p> : null}
      {list && accounts.length === 0 ? (
        <div className="mt-4 flex h-28 items-center justify-center rounded-xl border border-white/10 text-sm text-white/45">
          No profiles are connected to this Clipstake user yet.
        </div>
      ) : null}

      <ul className="mt-4 space-y-3">
        {accounts.map((account) => <AccountRow key={account.id} account={account} />)}
      </ul>
      {list?.next_cursor ? (
        <button type="button" onClick={() => void loadMore()} className="mt-4 text-sm text-white/70 underline-offset-4 hover:underline">
          Load more
        </button>
      ) : null}
      {list?.notice ? <p className="mt-4 text-xs text-white/35">{list.notice}</p> : null}
    </main>
  );
}

function AccountRow({ account }: { account: PostingAccount }) {
  const note = accountStatusNote(account);
  const followers = formatFollowers(account.followers_count);
  const ready = canSubmitAccount(account);
  return (
    <li>
      <Link href={`/accounts/${account.id}`} className="block rounded-xl border border-white/10 bg-[#141414] px-4 py-3 hover:border-white/25">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">@{account.handle}</p>
            <p className="mt-0.5 text-xs uppercase tracking-wide text-white/40">{account.platform}</p>
          </div>
          <span className={cn("rounded-full px-2 py-0.5 text-xs", ready ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300")}>
            {account.status.replaceAll("_", " ")}
          </span>
        </div>
        <p className="mt-2 text-xs text-white/50">
          {followers ? `${followers} followers` : "Followers not available"}
          {account.viewer_locations_available === true ? " · viewer countries on file" : ""}
          {account.viewer_locations_available === false ? " · no viewer countries" : ""}
        </p>
        {note ? <p className="mt-2 text-xs leading-5 text-white/55">{note}</p> : null}
      </Link>
    </li>
  );
}
