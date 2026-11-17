"use client";

import dynamic from "next/dynamic";

const HomeApp = dynamic(() => import("@/components/home-app"), { ssr: false });

export function CreateApp() {
  return <HomeApp />;
}
