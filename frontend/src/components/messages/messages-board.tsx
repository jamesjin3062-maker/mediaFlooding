"use client";

import { useState } from "react";
import { Building2, Eye, MessageSquare, Plus } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function MessagesBoard() {
  const [showClosed, setShowClosed] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [browseNote, setBrowseNote] = useState(false);

  function closeTicket(open: boolean) {
    setTicketOpen(open);
    if (!open) setBrowseNote(false);
  }

  return (
    <main className="flex min-h-[calc(100dvh-3.5rem)] w-full">
      <h1 className="sr-only">Messages</h1>
      <section className="flex w-full flex-col border-r md:w-80 md:shrink-0">
        <div className="flex items-center justify-center gap-2 px-4 py-4">
          <button
            type="button"
            aria-pressed={showClosed}
            onClick={() => setShowClosed((value) => !value)}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold tracking-wide text-foreground"
          >
            <Eye className="size-3.5" />
            {showClosed ? "CLOSED SHOWN" : "SHOW CLOSED"}
          </button>
          <button
            type="button"
            onClick={() => setTicketOpen(true)}
            className="inline-flex h-8 items-center gap-1 rounded-full bg-[oklch(0.89_0.19_128)] px-3 text-[11px] font-semibold tracking-wide text-[oklch(0.2_0.03_130)] hover:brightness-105"
          >
            <Plus className="size-3.5" />
            NEW TICKET
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16 text-center">
          <span className="flex size-10 items-center justify-center rounded-lg border text-muted-foreground">
            <MessageSquare className="size-4" />
          </span>
          {showClosed ? (
            <>
              <p className="mt-4 text-sm font-semibold">No conversations.</p>
              <p className="mt-1 max-w-[14rem] text-sm text-muted-foreground">Open a new ticket to start one.</p>
            </>
          ) : (
            <p className="mt-4 text-sm font-semibold">No messages yet.</p>
          )}
        </div>
      </section>

      <section className="hidden flex-1 flex-col items-center justify-center md:flex">
        <MessageSquare className="size-5 text-muted-foreground" />
        <p className="mt-3 text-sm text-muted-foreground">Pick a conversation on the left.</p>
      </section>

      <Dialog open={ticketOpen} onOpenChange={closeTicket}>
        <DialogContent
          showCloseButton={false}
          overlayClassName="bg-black/80 backdrop-blur-sm"
          className="max-w-[28rem] gap-0 rounded-2xl border-border bg-popover p-6 text-center shadow-2xl"
        >
          <DialogTitle className="text-center text-[15px] font-semibold leading-snug tracking-tight">Join an organization to open a ticket</DialogTitle>
          <p className="mx-auto mt-2.5 max-w-[24rem] text-center text-sm leading-6 text-muted-foreground">
            Tickets connect you with an organization&apos;s team. Join an organization that accepts tickets to get help.
          </p>
          <div className="mt-5 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => closeTicket(false)}
              className="inline-flex h-9 items-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setBrowseNote(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[oklch(0.89_0.19_128)] px-3.5 text-sm font-semibold text-[oklch(0.2_0.03_130)] transition hover:brightness-105"
            >
              <Building2 className="size-4" />
              Browse organizations
            </button>
          </div>
          {browseNote ? <p className="mt-4 text-center text-sm text-muted-foreground">No organizations are accepting tickets yet.</p> : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
