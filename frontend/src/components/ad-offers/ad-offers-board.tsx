"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp, CreditCard, MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";

type Filter = "all" | "needs" | "waiting" | "done";
type SortKey = "sent" | "payout";

const FILTERS: { id: Filter; label: string; title: string; body: string }[] = [
  { id: "all", label: "All", title: "No ad offers yet", body: "When a brand offers to run a paid ad on one of your verified pages, it'll show up here." },
  { id: "needs", label: "Needs you", title: "Nothing here", body: "You're all caught up — nothing needs a response." },
  { id: "waiting", label: "Waiting", title: "Nothing here", body: "Nothing pending on the brand side." },
  { id: "done", label: "Done", title: "Nothing here", body: "Settled offers will collect here." },
];

export function AdOffersBoard() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortKey | null>(null);
  const [ascending, setAscending] = useState(true);
  const [rows, setRows] = useState("25");
  const active = FILTERS.find((item) => item.id === filter) ?? FILTERS[0];

  function toggleSort(key: SortKey) {
    if (sort === key) setAscending((value) => !value);
    else {
      setSort(key);
      setAscending(true);
    }
  }

  return (
    <main className="flex min-h-[calc(100dvh-3.5rem)] w-full flex-col">
      <h1 className="sr-only">Ad Offers</h1>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-6">
        <div className="inline-flex rounded-full border bg-muted/40 p-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-sm",
                filter === item.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
              <span className={cn("tabular-nums", item.id === "needs" ? "text-[oklch(0.55_0.12_145)]" : "")}>0</span>
            </button>
          ))}
        </div>
        <Link href="/social-pr/rate-card" className="inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-sm hover:bg-muted">
          <CreditCard className="size-3.5" />
          Rate card
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="grid min-w-[40rem] grid-cols-[1.3fr_1.3fr_0.7fr_0.8fr_0.7fr] border-b px-4 text-sm font-medium sm:px-6">
          <span className="py-2">Brand</span>
          <span className="py-2">Deliverable</span>
          <button type="button" onClick={() => toggleSort("sent")} className="inline-flex items-center gap-1 py-2 text-left">
            Sent
            {sort === "sent" && !ascending ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5 text-muted-foreground" />}
          </button>
          <span className="py-2">Status</span>
          <button type="button" onClick={() => toggleSort("payout")} className="inline-flex items-center gap-1 py-2 text-left">
            Payout
            {sort === "payout" && !ascending ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5 text-muted-foreground" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex size-10 items-center justify-center rounded-lg border text-muted-foreground">
          <MessageSquare className="size-4" />
        </span>
        <p className="mt-3 text-sm font-semibold">{active.title}</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{active.body}</p>
      </div>

      <div className="flex items-center justify-between border-t py-2 pl-4 pr-20 text-xs text-muted-foreground sm:pl-6">
        <p>TOTAL OFFERS <span className="ml-2 text-foreground">0</span></p>
        <label className="inline-flex items-center gap-2">
          ROWS
          <select value={rows} onChange={(event) => setRows(event.target.value)} className="h-7 rounded-md border bg-background px-2 text-foreground">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>
    </main>
  );
}
