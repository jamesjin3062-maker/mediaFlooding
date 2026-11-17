import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const removedBlogPosts = new Set([
    "/blog/tiktok-publishing-is-live",
    "/blog/supoclip-vs-supo-live",
    "/blog/supoclip-vs-opusclip",
    "/blog/self-host-supoclip-docker",
    "/blog/best-free-opusclip-alternative",
  ]);
  const hidden =
    pathname === "/faq" ||
    (pathname.startsWith("/blog/") && !removedBlogPosts.has(pathname));
  if (hidden) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return NextResponse.redirect(url);
  }
  
  const isLandingOnlyModeEnabled =
    process.env.NEXT_PUBLIC_LANDING_ONLY_MODE === "true";

  if (!isLandingOnlyModeEnabled) {
    return NextResponse.next();
  }

  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/billing/webhook") ||
    pathname.startsWith("/ingest/") ||
    // Opt-outs (including mailbox one-click POSTs) must work in every mode.
    pathname === "/email/product-updates/unsubscribe" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.json(
      { error: "SupoClip is in landing-page-only mode." },
      { status: 503 }
    );
  }

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/:path*",
};
