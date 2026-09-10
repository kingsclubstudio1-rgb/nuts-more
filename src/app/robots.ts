import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

const BASE = `https://${SITE.web}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private or transactional areas: nothing to rank, and crawling them
      // wastes budget and can surface order/account URLs in search results.
      disallow: [
        "/admin",
        "/admin/",
        "/account",
        "/checkout",
        "/auth/",
        "/api/",
        "/login",
        "/forgot-password",
        "/reset-password",
      ],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
