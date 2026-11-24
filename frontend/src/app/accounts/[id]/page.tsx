"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { accountStatusNote, canSubmitAccount, type AccountList, type InstagramPost, type MediaList, type PostingAccount } from "@/lib/clipstake-accounts";
import { platformLabel } from "@/lib/clipstake";

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
      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-8 md:py-10">
        <Link href="/accounts" className="text-sm text-muted-foreground hover:text-foreground">Accounts</Link>
        {missing ? <p className="mt-6 text-sm text-muted-foreground">No such account.</p> : null}
        {!account && !missing ? <p className="mt-6 text-sm text-muted-foreground">Loading account…</p> : null}
        {account ? (
          <article className="mt-4">
            <h1 className="font-display text-3xl font-bold tracking-tight">@{account.handle}</h1>
            <p className="mt-1 text-sm uppercase tracking-wide text-muted-foreground">{platformLabel(account.platform)} · {account.status.replaceAll("_", " ")}</p>
            {note ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{note}</p> : null}
            {!canSubmitAccount(account) ? <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">Submit is off for this account.</p> : null}

            {account.platform === "instagram" ? (
              <section className="mt-6">
                <Button type="button" onClick={() => void loadPosts(null)} disabled={loadingPosts}>
                  {posts ? "Refresh posts" : "Load posts"}
                </Button>
                {mediaError ? <p className="mt-3 text-sm text-destructive">{mediaError}</p> : null}
                <ul className="mt-4 space-y-3">
                  {(posts ?? []).map((post) => (
                    <li key={post.media_id} className="rounded-xl border bg-card p-3 text-card-foreground shadow-sm">
                      <p className="text-sm">{post.caption || "No caption"}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{post.like_count} likes · {post.comments_count} comments</p>
                      {post.submitted ? <p className="mt-2 text-xs text-muted-foreground">Already submitted. It cannot be submitted again.</p> : null}
                      {post.permalink ? <a href={post.permalink} className="mt-2 block truncate text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">{post.permalink}</a> : null}
                    </li>
                  ))}
                </ul>
                {cursor ? (
                  <Button type="button" variant="outline" onClick={() => void loadPosts(cursor)} className="mt-3">
                    Load more posts
                  </Button>
                ) : null}
              </section>
            ) : null}

            {account.platform === "x" ? (
              <div className="mt-6 space-y-2">
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
