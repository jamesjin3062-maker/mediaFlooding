import { NextResponse } from "next/server";

import { listCampaigns } from "@/lib/clipstake";

export async function GET() {
  const list = await listCampaigns();
  return NextResponse.json(list);
}
