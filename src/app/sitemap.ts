import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/cms";
import { SITE } from "@/lib/site";
import { POLICIES } from "@/lib/policies";

const BASE = `https://${SITE.web.replace(/^www\./, "www.")}`;

export const dynamic = "force-dynamic";

/**
 * Lists every page worth indexing. Product and category URLs come from the
 * live catalog so newly added products are discoverable without a code change.
 * Account, checkout, admin and auth routes are deliberately absent — they are
 * private or transactional and have nothing to rank.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/bulk`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/corporate-gifting`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/case-studies`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const policyPages: MetadataRoute.Sitemap = Object.keys(POLICIES).map((slug) => ({
    url: `${BASE}/policies/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const [products, categories] = await Promise.all([getProducts(), getCategories()]);
    dynamicPages = [
      ...categories.map((c) => ({
        url: `${BASE}/products/${c.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...products
        .filter((p) => !p.hidden)
        .map((p) => ({
          url: `${BASE}/product/${p.slug}`,
          lastModified: now,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })),
    ];
  } catch {
    // A catalog outage shouldn't produce a broken sitemap — serve the static
    // pages rather than failing the whole route.
  }

  return [...staticPages, ...policyPages, ...dynamicPages];
}
