import { cn } from "@/lib/utils";

/** Wave mark for Media Flooding. Strokes follow the current text color. */
export function MediaFloodingLogo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5 text-foreground", className)}>
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="9" className="fill-[oklch(0.32_0.03_230)] dark:fill-[oklch(0.28_0.03_230)]" />
        <path d="M5 21.5c2.2-2.6 4.2-2.6 6.4 0s4.2 2.6 6.4 0 4.2-2.6 8.8 0" fill="none" stroke="oklch(0.78 0.04 195)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M5 16c2.2-2.6 4.2-2.6 6.4 0s4.2 2.6 6.4 0 4.2-2.6 8.8 0" fill="none" stroke="oklch(0.86 0.03 220)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M5 10.5c2.2-2.6 4.2-2.6 6.4 0s4.2 2.6 6.4 0 4.2-2.6 8.8 0" fill="none" stroke="oklch(0.94 0.02 235)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {compact ? <span className="sr-only">Media Flooding</span> : (
        <span className="font-display text-[15px] font-bold leading-none tracking-tight">
          Media <span className="font-semibold text-muted-foreground">Flooding</span>
        </span>
      )}
    </span>
  );
}

export function shellTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/wallet")) return "Wallet";
  if (pathname.startsWith("/campaigns")) return "Campaigns";
  if (pathname.startsWith("/accounts")) return "Accounts";
  if (pathname.startsWith("/create")) return "Create";
  if (pathname.startsWith("/list") || pathname.startsWith("/tasks")) return "Library";
  if (pathname.startsWith("/bounties")) return "Bounties";
  if (pathname.startsWith("/social-pr")) return "Ad Offers";
  if (pathname.startsWith("/submissions")) return "Submissions";
  if (pathname.startsWith("/announcements")) return "Announcements";
  if (pathname.startsWith("/messages")) return "Messages";
  if (pathname.startsWith("/refer")) return "Refer & Earn";
  if (pathname.startsWith("/settings/social")) return "Social";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/admin")) return "Admin";
  return "Media Flooding";
}
