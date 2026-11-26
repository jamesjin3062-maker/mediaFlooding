import { BountyCard } from "@/components/bounties/bounty-card";
import { listBounties } from "@/lib/bounties";

export function BountiesBoard() {
  const bounties = listBounties();
  const open = bounties.filter((bounty) => bounty.status === "open");

  return (
    <main className="w-full px-4 py-8 sm:px-6 md:py-10">
      <h1 className="flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
        Bounties
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{open.length}</span>
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">Fixed-reward clips. Open a card to read the brief.</p>
      <div className="mt-4 grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(100%,18rem),1fr))]">
        {open.map((bounty) => <BountyCard key={bounty.id} bounty={bounty} />)}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Sample bounties. A live bounty list is not connected yet.</p>
    </main>
  );
}
