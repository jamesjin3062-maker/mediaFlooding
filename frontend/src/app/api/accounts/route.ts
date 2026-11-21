import { NextResponse } from "next/server";

import { listAccounts } from "@/lib/clipstake-accounts";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const list = await listAccounts({
    platform: url.searchParams.get("platform"),
    cursor: url.searchParams.get("cursor"),
  });
  return NextResponse.json(list);
}
