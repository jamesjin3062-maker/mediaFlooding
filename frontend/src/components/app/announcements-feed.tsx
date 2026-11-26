"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAnnouncements } from "@/hooks/use-announcements";
import { useSession } from "@/lib/auth-client";
import { markAnnouncementsRead } from "@/lib/announcement-reads";
import type { Announcement } from "@/lib/announcements";

function postedLabel(iso: string) {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return "";
  const days = Math.floor((Date.now() - then.getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString("en-US");
}

function AnnouncementText({ value, className }: { value: string; className?: string }) {
  const parts = value.split(/(https?:\/\/[^\s]+)/g);
  return (
    <p className={className}>
      {parts.map((part, index) =>
        part.startsWith("http") ? (
          <a
            key={`${part}-${index}`}
            href={part}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="text-[oklch(0.55_0.12_145)] underline dark:text-[oklch(0.82_0.14_130)]"
          >
            {part}
          </a>
        ) : (
          <span key={`${index}-${part.slice(0, 12)}`}>{part}</span>
        ),
      )}
    </p>
  );
}

function PostHeading({ item }: { item: Announcement }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">MF</span>
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 text-sm">
          <span className="font-semibold">Media Flooding</span>
          <span className="text-[10px] font-semibold tracking-wide text-[oklch(0.45_0.1_145)] dark:text-[oklch(0.86_0.16_128)]">PLATFORM</span>
        </p>
        <time dateTime={item.publishedAt} className="text-xs text-muted-foreground">{postedLabel(item.publishedAt)}</time>
      </div>
    </div>
  );
}

function AnnouncementPost({ item, onOpen }: { item: Announcement; onOpen: (item: Announcement) => void }) {
  const showLink = item.href && item.href !== "/announcements";
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(item);
        }
      }}
      className="flex cursor-pointer gap-3 border-b py-5 text-left hover:bg-muted/40"
    >
      <div className="min-w-0 flex-1 px-1">
        <PostHeading item={item} />
        <h2 className="mt-4 text-sm font-bold">{item.title}</h2>
        <AnnouncementText value={item.description} className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground/90" />
        {showLink ? (
          <a
            href={item.href}
            onClick={(event) => event.stopPropagation()}
            className="mt-3 inline-block text-sm text-[oklch(0.55_0.12_145)] underline dark:text-[oklch(0.82_0.14_130)]"
          >
            {item.action || item.href}
          </a>
        ) : null}
      </div>
    </article>
  );
}

function AnnouncementDialog({ item, onClose }: { item: Announcement | null; onClose: () => void }) {
  const showLink = item?.href && item.href !== "/announcements";
  return (
    <Dialog open={item !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0 sm:max-w-xl">
        {item ? (
          <>
            <div className="flex items-start border-b px-5 py-4 pr-12">
              <PostHeading item={item} />
            </div>
            <div className="px-5 py-5">
              <DialogTitle className="text-base font-bold leading-snug">{item.title}</DialogTitle>
              <AnnouncementText value={item.description} className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground/90" />
              {showLink ? (
                <a href={item.href} className="mt-4 inline-block text-sm text-[oklch(0.55_0.12_145)] underline dark:text-[oklch(0.82_0.14_130)]">
                  {item.action || item.href}
                </a>
              ) : null}
            </div>
            <div className="border-t px-5 py-3 text-muted-foreground">
              <Heart className="size-4" />
            </div>
          </>
        ) : (
          <DialogTitle className="sr-only">Announcement</DialogTitle>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AnnouncementsFeed({ initialPostId = null }: { initialPostId?: string | null }) {
  const router = useRouter();
  const { data: session } = useSession();
  const announcements = useAnnouncements(true);
  const userId = session?.user?.id;
  const [selectedId, setSelectedId] = useState<string | null>(initialPostId);

  useEffect(() => {
    setSelectedId(initialPostId);
  }, [initialPostId]);

  useEffect(() => {
    markAnnouncementsRead(userId, announcements.map((item) => item.id));
  }, [announcements, userId]);

  const selected = announcements.find((item) => item.id === selectedId) ?? null;

  const open = (item: Announcement) => {
    setSelectedId(item.id);
    router.replace(`/announcements?post=${encodeURIComponent(item.id)}`, { scroll: false });
  };

  const close = () => {
    setSelectedId(null);
    router.replace("/announcements", { scroll: false });
  };

  return (
    <main className="w-full px-4 py-2 sm:px-8">
      <h1 className="sr-only">Announcements</h1>
      {announcements.length === 0 ? <p className="py-16 text-center text-sm text-muted-foreground">No announcements yet.</p> : null}
      {announcements.map((item) => <AnnouncementPost key={item.id} item={item} onOpen={open} />)}
      <AnnouncementDialog item={selected} onClose={close} />
    </main>
  );
}
