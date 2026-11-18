import { NextResponse } from "next/server";

import { getCampaign } from "@/lib/clipstake";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const result = await getCampaign(id);
  if (!result.campaign) return NextResponse.json({ error: "No such campaign." }, { status: 404 });
  return NextResponse.json({ source: result.source, campaign: result.campaign });
}
