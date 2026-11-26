"use client";

import Link from "next/link";
import { ArrowLeft, ChevronDown, Loader2 } from "lucide-react";
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

function PostsAction({ loading, idle, busy, onClick }: { loading: boolean; idle: string; busy: string; onClick: () => void }) {
  return (
    <span className="relative inline-flex shrink-0 overflow-hidden rounded-full p-px">
      <span
        aria-hidden
        className={cn(
          "absolute inset-[-140%] bg-[conic-gradient(from_0deg,transparent_62%,oklch(0.55_0.05_155)_82%,transparent)] dark:bg-[conic-gradient(from_0deg,transparent_62%,oklch(0.82_0.04_155)_82%,transparent)]",
          loading ? "opacity-0" : "animate-spin [animation-duration:2.8s]",
        )}
      />
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className={cn("relative inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition hover:brightness-95 disabled:opacity-70 dark:hover:brightness-110", calm.sage.surface)}
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : null}
        {loading ? busy : idle}
      </button>
    </span>
  );
}

function postedLabel(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function PostSummary({ post }: { post: InstagramPost }) {
  const when = postedLabel(post.posted_at);
  return (
    <>
      {post.thumbnail_url ? (
        <img src={post.thumbnail_url} alt="" className="aspect-[4/5] w-full bg-muted object-cover" />
      ) : (
        <div className="flex aspect-[4/5] w-full items-center justify-center bg-muted text-xs text-muted-foreground">No preview</div>
      )}
      <div className="space-y-2 p-3">
        <p className="line-clamp-3 text-sm leading-5">{post.caption || "No caption"}</p>
        <p className="text-xs text-muted-foreground">
          {post.like_count} likes · {post.comments_count} comments{when ? ` · ${when}` : ""}
        </p>
        {post.submitted ? (
          <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium", calm.sand.surface)}>Already submitted</span>
        ) : (
          <span className={cn("text-xs", calm.mist.text)}>Open post</span>
        )}
      </div>
    </>
  );
}

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
      <main className="w-full px-4 py-8 sm:px-6 md:py-10">
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
                  <h2 className="font-display text-lg font-semibold">Posts{posts ? <span className="ml-2 text-sm font-medium text-muted-foreground">{posts.length}</span> : null}</h2>
                  {posts ? (
                    <Button type="button" size="sm" variant="outline" onClick={() => void loadPosts(null)} disabled={loadingPosts}>
                      {loadingPosts ? "Refreshing…" : "Refresh posts"}
                    </Button>
                  ) : null}
                </div>
                {mediaError ? (
                  <div className="flex items-center justify-between gap-4 px-5 py-6">
                    <p className="min-w-0 text-sm text-destructive">{mediaError}</p>
                    <PostsAction loading={loadingPosts} idle="Try again" busy="Loading posts…" onClick={() => void loadPosts(null)} />
                  </div>
                ) : null}
                {!posts && !mediaError ? (
                  <div className="flex items-center justify-between gap-6 px-5 py-6">
                    <div className="min-w-0">
                      <p className="text-sm font-medium">Recent videos for @{account.handle} are not on this page yet.</p>
                      <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">Load them to review captions, likes, and comments. They stay off the page until you ask, so a visit does not fetch them every time.</p>
                    </div>
                    <PostsAction loading={loadingPosts} idle="Load recent posts" busy="Loading posts…" onClick={() => void loadPosts(null)} />
                  </div>
                ) : null}
                {posts && posts.length === 0 ? <p className="px-5 py-8 text-sm text-muted-foreground">This account has no videos to show.</p> : null}
                {posts && posts.length > 0 ? <ul className="grid gap-3 p-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,max(11rem,18%)),1fr))]">
                  {posts.map((post) => (
                    <li key={post.media_id} className="overflow-hidden rounded-xl border bg-background">
                      {post.permalink ? (
                        <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="block transition-colors hover:bg-muted/40">
                          <PostSummary post={post} />
                        </a>
                      ) : (
                        <PostSummary post={post} />
                      )}
                    </li>
                  ))}
                </ul> : null}
                {cursor ? (
                  <div className="flex justify-center border-t px-5 py-3">
                    <Button type="button" variant="outline" onClick={() => void loadPosts(cursor)} disabled={loadingPosts}>
                      {loadingPosts ? <Loader2 className="size-4 animate-spin" /> : <ChevronDown className="size-4 animate-bounce" />}
                      {loadingPosts ? "Loading more…" : "Load more posts"}
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
