"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Status = "all" | "pending" | "approved" | "denied";
type SortKey = "page" | "earnings" | "campaign" | "status" | "views" | "likes" | "comments" | "rate" | "posted";

const FILTERS: { id: Status; label: string; dot?: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending", dot: "bg-[oklch(0.78_0.14_85)]" },
  { id: "approved", label: "Approved", dot: "bg-[oklch(0.62_0.12_145)]" },
  { id: "denied", label: "Denied", dot: "bg-[oklch(0.62_0.16_25)]" },
];

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "page", label: "Page" },
  { key: "earnings", label: "Earnings" },
  { key: "campaign", label: "Campaign" },
  { key: "status", label: "Status" },
  { key: "views", label: "Views" },
  { key: "likes", label: "Likes" },
  { key: "comments", label: "Comments" },
  { key: "rate", label: "Eng. Rate" },
  { key: "posted", label: "Posted" },
];

export function SubmissionsBoard() {
  const [status, setStatus] = useState<Status>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey | null>(null);
  const [ascending, setAscending] = useState(true);
  const [rows, setRows] = useState("20");
  const statusFiltered = status !== "all";
  const filtered = statusFiltered || query.trim().length > 0;

  function toggleSort(key: SortKey) {
    if (sort === key) setAscending((value) => !value);
    else {
      setSort(key);
      setAscending(true);
    }
  }

  function clearFilters() {
    setStatus("all");
    setQuery("");
  }

  return (
    <main className="flex min-h-[calc(100dvh-3.5rem)] w-full flex-col">
      <h1 className="sr-only">Submissions</h1>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-6">
        <div className="inline-flex rounded-full border bg-muted/40 p-1">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStatus(item.id)}
              className={cn(
                "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-sm",
                status === item.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.dot ? <span className={cn("size-1.5 rounded-full", item.dot)} /> : null}
              {item.label}
              <span className="tabular-nums">0</span>
            </button>
          ))}
        </div>
        <label className="relative block w-full sm:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search link, caption, page..."
            className="h-8 w-full rounded-full border bg-background pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="grid min-w-[64rem] grid-cols-9 border-b px-4 text-sm font-medium sm:px-6">
          {COLUMNS.map((column) => (
            <button key={column.key} type="button" onClick={() => toggleSort(column.key)} className="inline-flex items-center gap-1 py-2 text-left">
              {column.label}
              {sort === column.key && !ascending ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5 text-muted-foreground" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex size-10 items-center justify-center rounded-lg border text-muted-foreground">
          <FileText className="size-4" />
        </span>
        <p className="mt-3 text-sm font-semibold">{statusFiltered ? "No submissions with this status" : "No submissions yet"}</p>
        {filtered ? (
          <button type="button" onClick={clearFilters} className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-sm text-muted-foreground hover:text-foreground">
            <X className="size-3.5" />
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="flex items-center justify-between border-t py-2 pl-4 pr-20 text-xs text-muted-foreground sm:pl-6">
        <p>TOTAL SUBMISSIONS <span className="ml-2 text-foreground">0</span></p>
        <label className="inline-flex items-center gap-2">
          ROWS
          <select value={rows} onChange={(event) => setRows(event.target.value)} className="h-7 rounded-md border bg-background px-2 text-foreground">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </label>
      </div>
    </main>
  );
}
