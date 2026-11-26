"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, ChevronDown, ShieldCheck } from "lucide-react";

import { MediaFloodingLogo } from "@/components/app/media-flooding-logo";
import { useSession } from "@/lib/auth-client";
import { LANDING_FAQS } from "@/lib/media-flooding-landing";
import { cn } from "@/lib/utils";

const PAYOUTS = ["$48", "$126", "$18", "$240", "$64", "$92", "$31", "$155", "$72", "$210"];

const CAMPAIGNS = [
  { name: "Harbor Reels", detail: "Instagram", views: "310K", budget: "$2,500", progress: "17%" },
  { name: "Northwind", detail: "Instagram · X", views: "1.2M", budget: "$6,000", progress: "32%" },
  { name: "Fieldday", detail: "Instagram", views: "980K", budget: "$4,500", progress: "33%" },
  { name: "Lumen Labs", detail: "X", views: "760K", budget: "$3,000", progress: "38%" },
  { name: "Copper", detail: "Instagram", views: "2.1M", budget: "$8,000", progress: "42%" },
];

const STEPS = [
  { title: "Open a campaign", body: "Read the brief, the rate per 1,000 views, and which platforms accept the clip." },
  { title: "Post, then submit the link", body: "Publish on an account you connected. Paste the post link so the views can be counted." },
  { title: "Watch verified views add up", body: "Checks run before a view touches the budget. What passes shows in your wallet." },
];

const CHECKS = [
  { title: "Submitted", body: "You post for a campaign and send the link in for review." },
  { title: "Checked", body: "The post is read against the brief, the account, and the view pattern." },
  { title: "Decided", body: "A post that misses the rules is rejected and never draws from the budget." },
  { title: "Re-checked", body: "Live posts are looked at again, so a later spike still has to hold up." },
];

const cta = "inline-flex h-11 items-center gap-2 rounded-[11px] bg-white px-4 text-sm font-semibold text-[oklch(0.22_0.05_255)] hover:bg-[oklch(0.94_0.03_230)]";

function GetStarted({ featured = false, compact = false }: { featured?: boolean; compact?: boolean }) {
  const { data: session } = useSession();
  const href = session?.user ? "/dashboard" : "/sign-in";
  return (
    <Link href={href} className={cn("group relative inline-flex rounded-xl transition-transform duration-500 hover:-translate-y-0.5 active:translate-y-0", featured && "p-[2px] hover:scale-[1.04]")}>
      {featured ? (
        <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
          <span className="landing-cta-spin absolute left-1/2 top-1/2 h-[240%] w-[240%] bg-[conic-gradient(from_0deg,transparent_0_55%,oklch(0.78_0.16_230)_78%,white_100%)]" />
        </span>
      ) : null}
      <span className={cn(cta, "relative overflow-hidden", compact && "h-8 gap-1.5 rounded-lg px-2.5 text-xs", featured && "landing-cta-glow")}>
        {featured ? <span aria-hidden className="landing-cta-sheen pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-transparent via-[oklch(0.75_0.12_230)] to-transparent opacity-80" /> : null}
        <span className="relative">Get Started</span>
        <ArrowRight className={cn("relative size-4 transition-transform duration-500 group-hover:translate-x-1.5", compact && "size-3.5")} />
      </span>
    </Link>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[oklch(0.145_0.004_260)] text-[oklch(0.96_0.004_260)]">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[oklch(0.145_0.004_260)]/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <Link href="/" aria-label="Media Flooding"><MediaFloodingLogo className="text-white [&_.text-muted-foreground]:text-white/60" /></Link>
          <GetStarted compact />
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pb-8 pt-16 sm:pt-24">
          <p className="text-sm text-white/55">Campaigns for people who already post</p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
            Post the clip. Get paid for the views.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
            Browse funded briefs, post on the Instagram and X accounts you already run, and let verified views turn into a balance.
          </p>
          <div className="mt-8">
            <GetStarted featured />
          </div>
        </section>

        <div className="mx-4 overflow-hidden rounded-full border border-white/10 py-4 sm:mx-8">
          <div className="landing-marquee flex w-max gap-3 px-3">
            {[...PAYOUTS, ...PAYOUTS].map((amount, index) => (
              <span key={`${amount}-${index}`} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80">
                <Check className="size-3.5 text-[oklch(0.86_0.14_130)]" />
                Sample {amount} for verified views
              </span>
            ))}
          </div>
        </div>

        <section className="mx-auto grid max-w-6xl gap-4 px-5 py-20 md:grid-cols-3">
          <div className="md:col-span-3">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
          </div>
          {STEPS.map((step, index) => (
            <article key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-white/45">0{index + 1}</p>
              <h3 className="mt-6 font-display text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{step.body}</p>
            </article>
          ))}
        </section>

        <section className="border-y border-white/10">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <ShieldCheck className="size-6 text-[oklch(0.86_0.14_130)]" />
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Every view is checked. Only real ones count.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/60">A post is reviewed when you submit it, then looked at again while it is live. Anything that fails stays off the budget.</p>
            </div>
            <ol className="space-y-3">
              {CHECKS.map((item, index) => (
                <li key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-white/40">{index + 1}</p>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/60">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="max-w-xl font-display text-3xl font-semibold tracking-tight sm:text-4xl">One place for the campaigns you join</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/60">Briefs, rates, and the accounts that can post them. This is a preview, not a live balance.</p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[oklch(0.17_0.006_260)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm">
              <span className="font-medium">Campaigns</span>
              <span className="text-white/45">Preview</span>
            </div>
            <ul>
              {CAMPAIGNS.map((campaign) => (
                <li key={campaign.name} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-white/8 px-4 py-3 last:border-b-0 sm:grid-cols-[1.4fr_0.8fr_0.5fr_0.5fr_auto]">
                  <span>
                    <span className="block font-medium">{campaign.name}</span>
                    <span className="text-xs text-white/45">{campaign.detail}</span>
                  </span>
                  <span className="hidden text-sm text-white/70 sm:block">{campaign.views}</span>
                  <span className="hidden text-sm text-white/70 sm:block">{campaign.budget}</span>
                  <span className="hidden text-sm text-[oklch(0.86_0.14_130)] sm:block">{campaign.progress}</span>
                  <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] text-white/70">Open</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 pb-20">
          <h2 className="font-display text-3xl font-semibold tracking-tight">Questions before you post</h2>
          <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
            {LANDING_FAQS.map((item) => <Faq key={item.question} question={item.question} answer={item.answer} />)}
          </div>
        </section>

        <section className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="font-display text-3xl font-semibold tracking-tight">Pick a brief and post.</h2>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 px-5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <MediaFloodingLogo className="text-white [&_.text-muted-foreground]:text-white/60" />
        </div>
      </footer>
    </div>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex w-full items-center justify-between gap-4 py-4 text-left">
        <span className="font-medium">{question}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-white/50 transition-transform", open && "rotate-180")} />
      </button>
      {open ? <p className="pb-4 text-sm leading-6 text-white/60">{answer}</p> : null}
    </div>
  );
}
