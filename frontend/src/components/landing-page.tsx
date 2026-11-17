"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const t = useTranslations("marketing");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center text-foreground">
      <h1 className="font-display text-[2.75rem] font-bold leading-[0.98] tracking-[-0.035em] text-balance sm:text-6xl lg:text-[5.5rem]">
        {t("hero.titleLine1")}
        <br />
        <span className="text-muted-foreground/70">{t("hero.titleLine2")}</span>
      </h1>
      <Button asChild variant="ghost" size="sm" className="mt-9 rounded-full">
        <Link href="/sign-in">{t("nav.signIn")}</Link>
      </Button>
    </div>
  );
}
