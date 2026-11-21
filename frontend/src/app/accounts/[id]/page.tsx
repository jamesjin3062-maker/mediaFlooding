"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/app/app-shell";
import { accountStatusNote, canSubmitAccount, type AccountList, type InstagramPost, type MediaList, type PostingAccount } from "@/lib/clipstake-accounts";

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
      <main className="min-h-full bg-[#0c0c0c] px-4 py-6 text-white sm:px-8">
        <Link href="/accounts" className="text-sm text-white/50 hover:text-white">Accounts</Link>
        {missing ? <p className="mt-6 text-sm text-white/50">No such account.</p> : null}
        {!account && !missing ? <p className="mt-6 text-sm text-white/45">Loading account…</p> : null}
        {account ? (
          <article className="mt-4 max-w-2xl">
            <h1 className="text-2xl font-semibold">@{account.handle}</h1>
            <p className="mt-1 text-sm uppercase tracking-wide text-white/40">{account.platform} · {account.status.replaceAll("_", " ")}</p>
            {note ? <p className="mt-3 text-sm leading-6 text-white/60">{note}</p> : null}
            {!canSubmitAccount(account) ? <p className="mt-2 text-sm text-amber-300">Submit is off for this account.</p> : null}

            {account.platform === "instagram" ? (
              <section className="mt-6">
                <button
                  type="button"
                  onClick={() => void loadPosts(null)}
                  disabled={loadingPosts}
                  className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-black disabled:opacity-50"
                >
                  {posts ? "Refresh posts" : "Load posts"}
                </button>
                {mediaError ? <p className="mt-3 text-sm text-red-400">{mediaError}</p> : null}
                <ul className="mt-4 space-y-3">
                  {(posts ?? []).map((post) => (
                    <li key={post.media_id} className="rounded-xl border border-white/10 bg-[#141414] p-3">
                      <p className="text-sm">{post.caption || "No caption"}</p>
                      <p className="mt-1 text-xs text-white/40">{post.like_count} likes · {post.comments_count} comments</p>
                      {post.submitted ? <p className="mt-2 text-xs text-white/50">Already submitted. It cannot be submitted again.</p> : null}
                      {post.permalink ? <a href={post.permalink} className="mt-2 block text-xs text-white/60 underline-offset-4 hover:underline">{post.permalink}</a> : null}
                    </li>
                  ))}
                </ul>
                {cursor ? (
                  <button type="button" onClick={() => void loadPosts(cursor)} className="mt-3 text-sm text-white/70 underline-offset-4 hover:underline">
                    Load more posts
                  </button>
                ) : null}
              </section>
            ) : null}

            {account.platform === "x" ? (
              <label className="mt-6 block">
                <span className="text-sm text-white/60">Post URL</span>
                <input
                  value={postUrl}
                  onChange={(event) => setPostUrl(event.target.value)}
                  placeholder="https://x.com/northwind/status/1845123456789012345"
                  className="mt-2 h-10 w-full rounded-lg border border-white/10 bg-transparent px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                />
              </label>
            ) : null}
          </article>
        ) : null}
      </main>
    </AppShell>
  );
}
