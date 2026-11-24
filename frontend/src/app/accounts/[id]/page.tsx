"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { campaignInitials } from "@/lib/campaign-mark";
import { calm, platformTone } from "@/lib/calm-color";
import { accountStatusNote, canSubmitAccount, type AccountList, type InstagramPost, type MediaList, type PostingAccount } from "@/lib/clipstake-accounts";
import { platformLabel } from "@/lib/clipstake";
import { cn } from "@/lib/utils";

export default function AccountDetailPage() {
  const params = useParams<{ id: string }>();
  const [account, setAccount] = useState<PostingAccount | null>(null);
  const [missing, setMissing] = useState(false);
  const [posts, setPosts] = useState<InstagramPost[] | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postUrl, setPostUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/accounts")
      .then(async (response) => response.json() as Promise<AccountList>)
      .then((body) => {
        if (cancelled) return;
        const match = body.data.find((item) => item.id === params.id) ?? null;
        setAccount(match);
        setMissing(!match);
      })
      .catch(() => {
        if (!cancelled) setMissing(true);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  async function loadPosts(nextCursor?: string | null) {
    setLoadingPosts(true);
    setMediaError(null);
    const query = nextCursor ? `?cursor=${encodeURIComponent(nextCursor)}` : "";
    const response = await fetch(`/api/accounts/${params.id}/media${query}`);
    const body = await response.json() as MediaList;
    setLoadingPosts(false);
    if (body.error) {
      const wait = body.error.retry_after ? ` Try again in ${body.error.retry_after} seconds.` : "";
      const request = body.error.request_id ? ` Request ${body.error.request_id}.` : "";
      setMediaError(`${body.error.message}${wait}${request}`);
      return;
    }
    setPosts((current) => nextCursor && current ? [...current, ...body.data] : body.data);
    setCursor(body.next_cursor);
  }

  const note = account ? accountStatusNote(account) : null;

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 md:py-12">
        <Link href="/accounts" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Accounts
        </Link>
        {missing ? <p className="mt-8 text-sm text-muted-foreground">No such account.</p> : null}
        {!account && !missing ? <p className="mt-8 text-sm text-muted-foreground">Loading account…</p> : null}
        {account ? (
          <article className="mt-6">
            <header className="overflow-hidden rounded-2xl border bg-card shadow-sm">
              <div className="flex items-start gap-4 px-5 py-6">
                <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl font-display text-lg font-bold", platformTone(account.platform))}>
                  {campaignInitials(account.handle)}
                </span>
                <div className="min-w-0">
                  <p className={cn("text-xs font-semibold uppercase tracking-[0.18em]", calm.mist.text)}>{platformLabel(account.platform)}</p>
                  <h1 className="mt-1 font-display text-4xl font-bold tracking-tight">@{account.handle}</h1>
                  <p className="mt-2 text-sm text-muted-foreground">{account.status.replaceAll("_", " ")}</p>
                </div>
              </div>
              {note ? <p className="border-t px-5 py-4 text-sm leading-6 text-muted-foreground">{note}</p> : null}
              {!canSubmitAccount(account) ? <p className={cn("border-t px-5 py-4 text-sm", calm.sand.text)}>Submit is off for this account.</p> : null}
            </header>

            {account.platform === "instagram" ? (
              <section className="mt-6 overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b px-5 py-3">
                  <h2 className="font-display text-lg font-semibold">Posts</h2>
                  <Button type="button" size="sm" onClick={() => void loadPosts(null)} disabled={loadingPosts}>
                    {posts ? "Refresh posts" : "Load posts"}
                  </Button>
                </div>
                {mediaError ? <p className="px-5 py-4 text-sm text-destructive">{mediaError}</p> : null}
                {!posts && !mediaError ? <p className="px-5 py-8 text-sm text-muted-foreground">Load posts when you are ready. They are not fetched on every visit.</p> : null}
                <ul>
                  {(posts ?? []).map((post) => (
                    <li key={post.media_id} className="border-b px-5 py-4 last:border-b-0">
                      <p className="text-sm leading-6">{post.caption || "No caption"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{post.like_count} likes · {post.comments_count} comments</p>
                      {post.submitted ? <p className="mt-2 text-xs text-muted-foreground">Already submitted. It cannot be submitted again.</p> : null}
                      {post.permalink ? <a href={post.permalink} className={cn("mt-2 block truncate text-xs underline-offset-4 hover:underline", calm.mist.text)}>{post.permalink}</a> : null}
                    </li>
                  ))}
                </ul>
                {cursor ? (
                  <div className="flex justify-center border-t px-5 py-3">
                    <Button type="button" variant="ghost" onClick={() => void loadPosts(cursor)}>
                      Load more posts
                    </Button>
                  </div>
                ) : null}
              </section>
            ) : null}

            {account.platform === "x" ? (
              <div className="mt-6 space-y-2 rounded-2xl border bg-card p-5 shadow-sm">
                <Label htmlFor="post-url">Post URL</Label>
                <Input
                  id="post-url"
                  value={postUrl}
                  onChange={(event) => setPostUrl(event.target.value)}
                  placeholder="https://x.com/northwind/status/1845123456789012345"
                />
              </div>
            ) : null}
          </article>
        ) : null}
      </main>
    </AppShell>
  );
}
