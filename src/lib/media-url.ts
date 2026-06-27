/**
 * Phase 7 — Media URL resolution.
 *
 * `src` columns on `product_images`, `product_videos`, `product_documents`
 * (and `poster` on videos) can hold one of three shapes:
 *
 *   1. An absolute URL — `https://cdn.example/foo.jpg` → returned as-is.
 *   2. A site-relative public path — `/wheelchair-hero.png` → returned as-is.
 *   3. A storage key into the `product-media` bucket — `gx-pro/cover.jpg`
 *      → rewritten to a public proxy route.
 *
 * The bucket itself is private (workspace policy blocks public buckets).
 * Reads are served by the `/api/public/media/$` route, which streams the
 * object using the service role. That gives crawlers and browsers a stable,
 * cache-friendly URL without leaking direct storage credentials.
 */

export const MEDIA_BUCKET = "product-media";
export const MEDIA_PROXY_PREFIX = "/api/public/media";

/** True if `src` is already a fully qualified or site-rooted URL. */
export function isResolvedMediaUrl(src: string): boolean {
  return /^https?:\/\//i.test(src) || src.startsWith("/");
}

/** Resolve any of the supported shapes into a fetchable URL. */
export function resolveMediaUrl(src: string | null | undefined): string {
  if (!src) return "";
  const trimmed = src.trim();
  if (!trimmed) return "";
  if (isResolvedMediaUrl(trimmed)) return trimmed;
  // Treat as a bucket-relative storage key.
  const key = trimmed.replace(/^\/+/, "");
  return `${MEDIA_PROXY_PREFIX}/${key}`;
}

/** Resolve and return the absolute URL when an origin is available. */
export function resolveAbsoluteMediaUrl(
  src: string | null | undefined,
  origin: string,
): string {
  const u = resolveMediaUrl(src);
  if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (!origin) return u;
  return `${origin.replace(/\/$/, "")}${u}`;
}
