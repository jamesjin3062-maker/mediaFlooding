import { NextResponse } from "next/server";

import { listAccountMedia } from "@/lib/clipstake-accounts";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const cursor = new URL(request.url).searchParams.get("cursor");
  const list = await listAccountMedia(id, cursor);
  const status = list.error?.status && list.error.status >= 400 ? list.error.status : 200;
  return NextResponse.json(list, { status });
}
