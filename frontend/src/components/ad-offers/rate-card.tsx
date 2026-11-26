"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";

type Account = { id: string; platform: string; handle: string; status: string };
type AccountList = { source: string; data: Account[] };

function verified(account: Account) {
  return account.status === "connected" && (account.platform === "instagram" || account.platform === "x");
}

type Slot = "post" | "video";
type Price = { amount: string; auto: boolean };
type Prices = Record<string, Partial<Record<Slot, Price>>>;

export function RateCard() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [prices, setPrices] = useState<Prices>({});
  const [editing, setEditing] = useState<{ id: string; slot: Slot } | null>(null);
  const [draft, setDraft] = useState("");
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/accounts")
      .then(async (response) => {
        const body = (await response.json().catch(() => null)) as AccountList | null;
        if (!response.ok || !body) throw new Error("Could not load pages.");
        return body;
      })
      .then((body) => {
        if (cancelled) return;
        if (body.source !== "clipstake") {
          setAccounts([]);
          setNotice("Verified pages are not connected yet.");
          return;
        }
        setAccounts(body.data.filter(verified));
      })
      .catch(() => {
        if (!cancelled) {
          setAccounts([]);
          setNotice("Verified pages are not connected yet.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function pricedCount(id: string) {
    const row = prices[id];
    return Number(Boolean(row?.post)) + Number(Boolean(row?.video));
  }

  function savePrice(id: string, slot: Slot) {
    const amount = draft.trim();
    if (amount) {
      setPrices((current) => ({ ...current, [id]: { ...current[id], [slot]: { amount, auto } } }));
    }
    setEditing(null);
    setDraft("");
    setAuto(false);
  }

  return (
    <main className="w-full px-4 py-6 sm:px-6 md:py-8">
      <Link href="/social-pr" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Ad Offers
      </Link>
      <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight">Rate card</h1>
      <p className="mt-1 text-sm text-muted-foreground">What brands see when composing offers. ⚡ = auto-accepts at that price.</p>

      <div className="mt-6 overflow-x-auto">
        <div className="grid min-w-[36rem] grid-cols-[minmax(0,1.4fr)_1fr_1fr] border-b text-xs font-medium tracking-wide text-muted-foreground">
          <span />
          <span className="px-3 py-2">POST</span>
          <span className="px-3 py-2">VIDEO</span>
        </div>
        {accounts === null ? <p className="px-1 py-6 text-sm text-muted-foreground">Loading pages…</p> : null}
        {accounts?.length === 0 ? <p className="px-1 py-6 text-sm text-muted-foreground">{notice}</p> : null}
        {accounts?.map((account) => (
          <div key={account.id} className="grid min-w-[36rem] grid-cols-[minmax(0,1.4fr)_1fr_1fr] border-b">
            <div className="flex items-center gap-3 py-3 pr-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                {account.handle.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate text-sm">
                  @{account.handle}
                  <PlatformMark platform={account.platform} />
                </p>
                <p className="text-xs text-muted-foreground">{pricedCount(account.id)}/2 priced</p>
              </div>
            </div>
            <PriceSlot
              price={prices[account.id]?.post}
              editing={editing?.id === account.id && editing.slot === "post"}
              draft={draft}
              auto={auto}
              onDraft={setDraft}
              onAuto={setAuto}
              onEdit={() => {
                setEditing({ id: account.id, slot: "post" });
                setDraft(prices[account.id]?.post?.amount ?? "");
                setAuto(prices[account.id]?.post?.auto ?? false);
              }}
              onSave={() => savePrice(account.id, "post")}
            />
            <PriceSlot
              price={prices[account.id]?.video}
              editing={editing?.id === account.id && editing.slot === "video"}
              draft={draft}
              auto={auto}
              onDraft={setDraft}
              onAuto={setAuto}
              onEdit={() => {
                setEditing({ id: account.id, slot: "video" });
                setDraft(prices[account.id]?.video?.amount ?? "");
                setAuto(prices[account.id]?.video?.auto ?? false);
              }}
              onSave={() => savePrice(account.id, "video")}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

function PriceSlot({
  price,
  editing,
  draft,
  auto,
  onDraft,
  onAuto,
  onEdit,
  onSave,
}: {
  price?: Price;
  editing: boolean;
  draft: string;
  auto: boolean;
  onDraft: (value: string) => void;
  onAuto: (value: boolean) => void;
  onEdit: () => void;
  onSave: () => void;
}) {
  if (editing) {
    return (
      <form
        className="flex items-center gap-2 px-3 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
      >
        <input
          value={draft}
          onChange={(event) => onDraft(event.target.value)}
          inputMode="decimal"
          placeholder="0.00"
          className="h-8 w-20 rounded-md border bg-background px-2 text-sm"
          autoFocus
        />
        <label className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <input type="checkbox" checked={auto} onChange={(event) => onAuto(event.target.checked)} />
          Auto
        </label>
      </form>
    );
  }
  if (price) {
    return (
      <button type="button" onClick={onEdit} className="px-3 py-3 text-left text-sm">
        ${price.amount}
        {price.auto ? " ⚡" : ""}
      </button>
    );
  }
  return (
    <button type="button" onClick={onEdit} className="inline-flex items-center gap-1 px-3 py-3 text-left text-sm text-muted-foreground hover:text-foreground">
      <Plus className="size-3.5" />
      Set price
    </button>
  );
}

function PlatformMark({ platform }: { platform: string }) {
  if (platform === "x") {
    return (
      <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-label="X" role="img">
        <path fill="currentColor" d="M4 4h4.2l3.7 5.2L16.2 4H20l-6.3 8.1L20.4 20h-4.2l-4.1-5.7L7.4 20H3.6l6.7-8.6L4 4Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="size-3.5 shrink-0" aria-label="Instagram" role="img">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  );
}
