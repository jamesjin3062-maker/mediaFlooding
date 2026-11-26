"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Check, Megaphone } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAnnouncements } from "@/hooks/use-announcements";
import type { Announcement } from "@/lib/announcements";
import { cn } from "@/lib/utils";

const READ_EVENT = "supoclip:announcements-read";
const memoryRead = new Map<string, string[]>();
const GROUPS = ["TODAY", "THIS WEEK", "EARLIER"] as const;

function storageKey(userId?: string) {
  return `supoclip:announcements-read:${userId ?? "visitor"}`;
}

function readIds(key: string): string[] {
  if (memoryRead.has(key)) return memoryRead.get(key)!;
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return memoryRead.get(key) ?? [];
  }
}

function shortAge(iso: string): string {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d`;
  return `${Math.round(days / 7)}w`;
}

function groupLabel(iso: string): (typeof GROUPS)[number] {
  const date = new Date(iso);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const days = Math.round((start - day) / 86_400_000);
  if (days <= 0) return "TODAY";
  if (days < 7) return "THIS WEEK";
  return "EARLIER";
}

function grouped(items: Announcement[]) {
  const buckets = new Map<string, Announcement[]>();
  const sorted = [...items].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  for (const item of sorted) {
    const label = groupLabel(item.publishedAt);
    buckets.set(label, [...(buckets.get(label) ?? []), item]);
  }
  return GROUPS.flatMap((label) => {
    const list = buckets.get(label);
    return list?.length ? [{ label, items: list }] : [];
  });
}

/** Bell menu: Inbox is unread, All is the announcement feed. */
export function HeaderNotifications({ userId }: { userId?: string }) {
  const key = storageKey(userId);
  const announcements = useAnnouncements();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"inbox" | "all">("inbox");
  const [filter, setFilter] = useState<"all" | "announcements">("all");
  const [read, setRead] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => setRead(readIds(key));
    sync();
    const syncStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== key) return;
      memoryRead.delete(key);
      sync();
    };
    window.addEventListener("storage", syncStorage);
    window.addEventListener(READ_EVENT, sync);
    return () => {
      window.removeEventListener("storage", syncStorage);
      window.removeEventListener(READ_EVENT, sync);
    };
  }, [key]);

  const unread = announcements.filter((item) => !read.includes(item.id));
  const source = tab === "inbox" ? unread : announcements;
  const visible = grouped(source);
  const markRead = (id: string) => {
    const ids = [...new Set([...read, id])];
    setRead(ids);
    try {
      window.localStorage.setItem(key, JSON.stringify(ids));
      memoryRead.delete(key);
    } catch {
      memoryRead.set(key, ids);
    }
    window.dispatchEvent(new Event(READ_EVENT));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={unread.length ? `Notifications, ${unread.length} unread` : "Notifications"}
          className="relative flex size-9 items-center justify-center rounded-xl bg-muted text-foreground hover:bg-accent"
        >
          <Bell className="size-4" />
          {unread.length > 0 ? <span aria-hidden className="absolute right-2 top-2 size-1.5 rounded-full bg-[oklch(0.82_0.12_145)]" /> : null}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={10} collisionPadding={16} translate="no" className="w-[min(26rem,calc(100vw-1.5rem))] rounded-2xl p-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <h2 className="font-display text-base font-semibold">Notifications</h2>
          <div className="flex items-center gap-1 text-sm">
            {(["inbox", "all"] as const).map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={tab === item}
                onClick={() => setTab(item)}
                className={cn("rounded-full px-3 py-1 capitalize", tab === item ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        {tab === "all" && announcements.length > 0 ? (
          <div className="flex items-center gap-1 border-t px-4 py-2.5 text-sm">
            {([
              ["all", `All ${announcements.length}`],
              ["announcements", `Announcements ${announcements.length}`],
            ] as const).map(([item, label]) => (
              <button
                key={item}
                type="button"
                aria-pressed={filter === item}
                onClick={() => setFilter(item)}
                className={cn("rounded-full px-3 py-1", filter === item ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {label}
              </button>
            ))}
          </div>
        ) : null}
        {visible.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <span className="flex size-10 items-center justify-center rounded-lg border text-muted-foreground">
              <Check className="size-4" />
            </span>
            <p className="mt-4 text-sm font-medium">You&apos;re all caught up</p>
            <p className="mt-1 max-w-[16rem] text-sm text-muted-foreground">New approvals, messages, and updates land here.</p>
          </div>
        ) : (
          <div className="max-h-[min(28rem,60dvh)] overflow-y-auto border-t px-2 py-2">
            {visible.map((group) => (
              <section key={group.label} className="pb-1">
                <h3 className="px-2 pb-1 pt-2 text-[11px] font-medium tracking-[0.14em] text-muted-foreground">{group.label}</h3>
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    href="/announcements"
                    onClick={() => { markRead(item.id); setOpen(false); }}
                    className="flex gap-3 rounded-xl px-2 py-2.5 hover:bg-muted/70"
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-[oklch(0.86_0.14_130)]">
                      <Megaphone className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-3">
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold">{item.title}</span>
                        <time dateTime={item.publishedAt} className="shrink-0 text-xs text-muted-foreground">{shortAge(item.publishedAt)}</time>
                      </span>
                      <span className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{item.description}</span>
                    </span>
                  </Link>
                ))}
              </section>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
