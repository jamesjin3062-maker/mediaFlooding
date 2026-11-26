"use client";

import { useState } from "react";
import { FileText, Info } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Brazil",
  "Mexico",
  "India",
  "Japan",
  "South Korea",
];

export function WalletBoard() {
  const [setupOpen, setSetupOpen] = useState(false);
  const [country, setCountry] = useState("United States");
  const [pickingCountry, setPickingCountry] = useState(false);
  const [finishNote, setFinishNote] = useState(false);

  function closeSetup(open: boolean) {
    setSetupOpen(open);
    if (!open) {
      setPickingCountry(false);
      setFinishNote(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100dvh-3.5rem)] w-full flex-col px-4 py-6 sm:px-6 md:py-8">
      <h1 className="font-display text-2xl font-semibold tracking-tight">Wallet</h1>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[oklch(0.45_0.04_95)] bg-[oklch(0.22_0.02_95)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[oklch(0.9_0.03_95)]">Complete payout setup to withdraw.</p>
        <button
          type="button"
          onClick={() => setSetupOpen(true)}
          className="inline-flex h-9 shrink-0 items-center rounded-xl bg-[oklch(0.89_0.19_128)] px-3 text-sm font-semibold text-[oklch(0.2_0.03_130)] hover:brightness-105"
        >
          Set up payout
        </button>
      </div>

      <Dialog open={setupOpen} onOpenChange={closeSetup}>
        <DialogContent showCloseButton={false} className="max-w-3xl border-white/10 bg-black p-5 sm:min-h-80 sm:p-6">
          <DialogTitle className="sr-only">Payout setup</DialogTitle>
          <div className="flex items-start gap-2.5 rounded-xl border border-[oklch(0.62_0.11_85)] px-4 py-3 text-sm text-[oklch(0.84_0.12_92)]">
            <Info className="mt-0.5 size-4 shrink-0" />
            <p>Finish your payout setup — a few more details are needed before payouts can start.</p>
          </div>
          <button
            type="button"
            onClick={() => setFinishNote(true)}
            className="mt-4 inline-flex h-10 w-fit items-center justify-self-start rounded-lg bg-[oklch(0.89_0.19_128)] px-4 text-sm font-semibold text-[oklch(0.22_0.04_130)] hover:brightness-105"
          >
            Finish setup
          </button>
          <p className="mt-4 text-sm text-[oklch(0.62_0.01_260)]">
            Not in {country}?{" "}
            <button
              type="button"
              onClick={() => setPickingCountry((open) => !open)}
              className="text-[oklch(0.75_0.01_260)] hover:text-white"
            >
              Change country
            </button>
          </p>
          {pickingCountry ? (
            <label className="mt-3 block text-sm text-muted-foreground">
              Country
              <select
                value={country}
                onChange={(event) => {
                  setCountry(event.target.value);
                  setPickingCountry(false);
                }}
                className="mt-1.5 block h-9 rounded-lg border border-white/15 bg-black px-3 text-sm text-foreground"
              >
                {COUNTRIES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          {finishNote ? (
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Payout setup is not connected yet. Your balance stays on this page until it is.
            </p>
          ) : null}
        </DialogContent>
      </Dialog>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground">AVAILABLE FOR WITHDRAWAL</p>
          <p className="mt-2 font-display text-5xl font-semibold tabular-nums tracking-tight sm:text-6xl">$0.00</p>
        </div>
        <div className="text-left sm:text-right">
          <button type="button" disabled className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-muted-foreground">
            Withdraw
          </button>
          <p className="mt-2 text-xs text-muted-foreground">Complete payout setup to withdraw.</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
        <span className="flex size-10 items-center justify-center rounded-lg border border-white/15 text-muted-foreground">
          <FileText className="size-4" />
        </span>
        <p className="text-sm font-medium">No activity yet</p>
      </div>
    </main>
  );
}
