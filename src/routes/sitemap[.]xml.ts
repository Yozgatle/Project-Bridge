import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry, isSitemapRouteIncluded } from "@/lib/sitemap";
import { BEZIRKE } from "@/lib/site";
import { REGIONS, SERVICE_DETAILS } from "@/lib/content";

const BASE_URL = "https://www.ceri.at";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));
        const dynamic: [keyof typeof router.routesById, "/leistungen/$slug" | "/bezirke/$slug" | "/umgebung/$slug", string[]][] = [
          ["/leistungen/$slug", "/leistungen/$slug", SERVICE_DETAILS.map((s) => s.slug)],
          ["/bezirke/$slug", "/bezirke/$slug", BEZIRKE.map((b) => b.slug)],
          ["/umgebung/$slug", "/umgebung/$slug", REGIONS.map((r) => r.slug)],
        ];
        for (const [routeId, to, slugs] of dynamic) {
          if (!isSitemapRouteIncluded(router.routesById[routeId])) continue;
          for (const slug of slugs) {
            const location = router.buildLocation({ to, params: { slug }, search: () => ({}), hash: "" });
            const path = sitemapPathForLocation(router, location, routeId as string);
            if (path) entries.push({ path });
          }
        }
        return new Response(sitemapXML(BASE_URL, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
