"use client";

import { useAnnouncements } from "@/hooks/use-announcements";

export function AnnouncementsFeed() {
  const announcements = useAnnouncements();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 md:py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight">Announcements</h1>
      <p className="mt-2 text-sm text-muted-foreground">News and updates for clippers.</p>
      {announcements.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No announcements yet.</p>
      ) : (
        <div className="mt-8 space-y-3">
          {announcements.map((item) => (
            <article key={item.id} className="rounded-xl border bg-card px-4 py-4">
              <h2 className="font-display text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
