/**
 * Where to go after signing in or up: a same-site `?next=/path`, else `fallback`.
 * Absolute and protocol-relative URLs are ignored so the param can't redirect off-site.
 * With no safe next path, both sign-in and sign-up open the dashboard.
 */
export function postAuthPath(search: string, fallback = "/dashboard"): string {
  const next = new URLSearchParams(search).get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}

/** Sign-in page that returns to `path` (pathname plus search) afterwards. */
export function signInPath(path: string): string {
  return `/sign-in?${new URLSearchParams({ next: path })}`;
}
