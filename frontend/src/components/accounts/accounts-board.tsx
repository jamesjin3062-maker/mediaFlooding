"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronsUpDown, MoreHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { campaignInitials } from "@/lib/campaign-mark";
import { calm } from "@/lib/calm-color";
import { canSubmitAccount, type AccountList, type PostingAccount } from "@/lib/clipstake-accounts";
import { cn } from "@/lib/utils";

type SortKey = "account" | "platform" | "followers" | "posts" | "views" | "earnings";
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "account", label: "Account" },
  { key: "platform", label: "Platform" },
  { key: "followers", label: "Followers" },
  { key: "posts", label: "Posts" },
  { key: "views", label: "Views" },
  { key: "earnings", label: "Earnings" },
];

function platformName(platform: string): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "x") return "Twitter";
  return platform;
}

function statusLabel(status: string): string {
  if (status === "connected") return "Connected";
  if (status === "reconnect_needed") return "Reconnect";
  if (status === "security_check") return "Security check";
  const label = status.replaceAll("_", " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function sortValue(account: PostingAccount, key: SortKey): string | number | null {
  if (key === "account") return account.handle;
  if (key === "platform") return platformName(account.platform);
  if (key === "followers") return account.followers_count;
  return null;
}

function compareAccounts(a: PostingAccount, b: PostingAccount, key: SortKey, dir: SortDir): number {
  const left = sortValue(a, key);
  const right = sortValue(b, key);
  if (left === null && right === null) return 0;
  if (left === null) return 1;
  if (right === null) return -1;
  const result = typeof left === "number" && typeof right === "number"
    ? left - right
    : String(left).localeCompare(String(right), undefined, { sensitivity: "base" });
  return dir === "asc" ? result : -result;
}

function formatCount(count: number): string {
  return new Intl.NumberFormat("en").format(count);
}

export function AccountsBoard({ initialList = null }: { initialList?: AccountList | null }) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "account", dir: "asc" });
  const [list, setList] = useState<AccountList | null>(initialList);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialList) return;
    let cancelled = false;
    void fetch("/api/accounts")
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
  }, [initialList]);

  async function loadMore() {
    if (!list?.next_cursor) return;
    const response = await fetch(`/api/accounts?cursor=${encodeURIComponent(list.next_cursor)}`);
    if (!response.ok) return;
    const page = await response.json() as AccountList;
    setList({ ...page, data: [...list.data, ...page.data] });
  }

  function toggleSort(key: SortKey) {
    setSort((current) => current.key === key
      ? { key, dir: current.dir === "asc" ? "desc" : "asc" }
      : { key, dir: "asc" });
  }

  const accounts = useMemo(() => {
    return [...(list?.data ?? [])].sort((a, b) => compareAccounts(a, b, sort.key, sort.dir));
  }, [list, sort]);
  const followers = accounts.reduce((sum, account) => sum + (account.followers_count ?? 0), 0);

  return (
    <main className="w-full px-4 py-4 md:px-6 md:py-5">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Accounts</h1>
      <p className="mt-4 font-display text-5xl font-semibold tabular-nums tracking-tight">{list ? formatCount(followers) : "—"}</p>
      <p className="mt-1 text-sm text-muted-foreground">followers</p>

      {error ? <p className="mt-6 text-sm text-destructive">{error}</p> : null}
      {list?.notice ? <p className="mt-4 text-xs text-muted-foreground">{list.notice}</p> : null}

      <div className="mt-5 flex items-center gap-2 border-b pb-2">
        <span className="text-xs font-semibold tracking-[0.16em]">ACCOUNTS</span>
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-xs tabular-nums text-muted-foreground">{list ? accounts.length : "—"}</span>
      </div>

      {!list && !error ? <AccountTableSkeleton /> : null}
      {list && accounts.length === 0 ? (
        <div className="flex h-36 flex-col items-center justify-center gap-1 text-center">
          <p className="font-display text-lg font-semibold">No profiles yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">Connect an Instagram or X profile in Clipstake, then it will show up here.</p>
        </div>
      ) : null}

      {accounts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-0 text-sm">
            <caption className="sr-only">Connected accounts</caption>
            <thead>
              <tr>
                {COLUMNS.map((column) => (
                  <th key={column.key} aria-sort={sort.key === column.key ? (sort.dir === "asc" ? "ascending" : "descending") : "none"} className="border-b px-2 py-2 text-left font-normal first:pl-0 last:pr-0">
                    <button type="button" onClick={() => toggleSort(column.key)} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                      {column.label}
                      <SortMark active={sort.key === column.key} dir={sort.dir} />
                    </button>
                  </th>
                ))}
                <th className="w-10 border-b" />
              </tr>
            </thead>
            <tbody>
              {accounts.map((account) => <AccountRow key={account.id} account={account} />)}
            </tbody>
          </table>
        </div>
      ) : null}

      {list?.next_cursor ? (
        <div className="flex justify-center py-4">
          <Button type="button" variant="ghost" onClick={() => void loadMore()}>Load more</Button>
        </div>
      ) : null}
    </main>
  );
}

function SortMark({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown className="size-3.5 opacity-60" />;
  return dir === "asc" ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />;
}

function AccountTableSkeleton() {
  return (
    <div className="space-y-px py-4">
      {Array.from({ length: 3 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 border-b py-2">
          <Skeleton className="size-9 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PlatformMark({ platform }: { platform: string }) {
  if (platform === "instagram") {
    return (
      <svg viewBox="0 0 24 24" className="size-2.5" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.4" />
        <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
      </svg>
    );
  }
  if (platform === "x") {
    return (
      <svg viewBox="0 0 24 24" className="size-2.5" aria-hidden>
        <path fill="currentColor" d="M4 4h4.2l3.7 5.2L16.2 4H20l-6.3 8.1L20.4 20h-4.2l-4.1-5.7L7.4 20H3.6l6.7-8.6L4 4Z" />
      </svg>
    );
  }
  return <span className="text-[9px] font-bold leading-none">{platform.slice(0, 1).toUpperCase()}</span>;
}

function AccountRow({ account }: { account: PostingAccount }) {
  const ready = canSubmitAccount(account);
  return (
    <tr className="group">
      <td className="border-b py-2 pr-2">
        <Link href={`/accounts/${account.id}`} className="flex items-center gap-3">
          <span className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
            {campaignInitials(account.handle)}
            <span aria-hidden className="absolute -bottom-0.5 -left-0.5 flex size-4 items-center justify-center rounded-full bg-background text-foreground ring-2 ring-background">
              <PlatformMark platform={account.platform} />
            </span>
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate font-medium">@{account.handle}</span>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium", ready ? calm.sage.surface : calm.sand.surface)}>
              {statusLabel(account.status)}
            </span>
          </span>
        </Link>
      </td>
      <td className="border-b px-2 py-2 text-muted-foreground">{platformName(account.platform)}</td>
      <td className="border-b px-2 py-2 tabular-nums text-muted-foreground">{account.followers_count === null ? "—" : formatCount(account.followers_count)}</td>
      <td className="border-b px-2 py-2 text-muted-foreground">—</td>
      <td className="border-b px-2 py-2 text-muted-foreground">—</td>
      <td className={cn("border-b px-2 py-2", calm.sage.text)}>—</td>
      <td className="border-b pl-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button type="button" aria-label={`Actions for @${account.handle}`} className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
              <MoreHorizontal className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/accounts/${account.id}`}>Open account</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
