/**
 * Phase 7 — Public media proxy.
 *
 * Streams objects from the private `product-media` Supabase Storage bucket
 * so visitors and crawlers can fetch product imagery without the bucket
 * being public. Read-only; writes happen only via service-role tooling.
 *
 * URL shape: `/api/public/media/<storage-key>` (path is a splat).
 */
import { createFileRoute } from "@tanstack/react-router";
import { MEDIA_BUCKET } from "@/lib/media-url";

export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = (params._splat ?? "").replace(/^\/+/, "");
        if (!key || key.includes("..")) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );
        const { data, error } = await supabaseAdmin.storage
          .from(MEDIA_BUCKET)
          .download(key);

        if (error || !data) {
          return new Response("Not found", { status: 404 });
        }

        const buf = await data.arrayBuffer();
        return new Response(buf, {
          status: 200,
          headers: {
            "content-type": data.type || "application/octet-stream",
            "cache-control": "public, max-age=3600, s-maxage=86400, immutable",
          },
        });
      },
    },
  },
});
