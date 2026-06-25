# Nuts & More

**Premium gourmet dates, dry fruits, nuts, seeds & makhana — plus bespoke corporate gifting.**
Hand-picked with care and love since 2019. (Nuts & More Trading LLP, Bengaluru.)

Built with **Next.js 16 (App Router) + Tailwind CSS v4**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Pages

| Route | Description |
| --- | --- |
| `/` | Home — hero slideshow, trusted-by, category grid, benefits, "Ponds to Plates" band, bestsellers, makhana recipe, gift hampers, platforms, testimonials, CTA |
| `/products` | All products + category grid + interactive filter |
| `/products/[category]` | Per-category listing — Nuts, Dry Fruits, Seeds, Makhana, Trail Mix & Muesli, Gift Hampers (6 SSG pages) |
| `/about` | Story, mission/vision/values, excellence stats, quality-assurance process |
| `/corporate-gifting` | Process, case studies, enquiry form |
| `/bulk` | Wholesale tiers, perks, bulk enquiry form |
| `/contact` | Real Bengaluru contact info, map, validated form |

## Brand

- Logo: real squirrel badge at `public/brand/logo.png` (extracted from the supplied artwork).
- Contact / catalog / copy live in `src/lib/site.ts`, `src/lib/products.ts`, `src/lib/content.ts`.
- Real contact: +91 95357 78855 · contact@nutsandmore.biz · www.nutsandmore.store ·
  173/1, 4th Floor, SC Road, Hotel Samrat Residency, Seshadripuram, Bengaluru 560020.

## Design system

- **Playful pastel** anchored on the brand **brown** (squirrel logo) with candy pastels
  (blush, peach, butter, mint, sky, lavender) for section colour-blocking. Tokens in
  `src/app/globals.css`.
- **Type:** Fredoka (rounded headings), Nunito (body), Pacifico (pink script accents).
- **Graphics:** hand-drawn SVG doodles — squirrel mascot, makhana, nuts, leaves, lotus —
  in `src/components/graphics/doodles.tsx`, plus wavy section dividers. Floating/bob/sway
  animations throughout, all respecting `prefers-reduced-motion`.

> Note: `var(--color-*)` theme tokens are NOT usable in inline `style` (Tailwind v4
> `@theme inline` inlines them). For inline styles use the raw `:root` vars, e.g.
> `var(--blush)`, `var(--cream)`, `var(--brown-ink)`.

## Images — placeholders

Product/background imagery are **real, relevance-filtered stock photos** bundled in
`public/img/<seed>.jpg`. The mapping lives in the `imageId` fields (format
`"keywords|seed"`), resolved to a local path by `img()` in `src/lib/utils.ts`.

To go live: drop real product photography into `public/img` (same filenames), then remove
`images.unoptimized` from `next.config.ts` to re-enable responsive optimization. Makhana
shots are approximate (scarce in stock libraries) — replace these first.

## Notes

- Prices are reasonable placeholders (the supplied product list had no pricing).
- Forms (`contact`, `enquiry`) validate client-side and simulate submission — wire them to a
  backend / email service before launch.
- "Add to cart", auth and checkout are not implemented yet (scaffold only).
- Certification names (MSME, IEC, APEDA, FSSAI, Make in India, FDA) render as text badges in
  the footer — swap for official logos when available.
