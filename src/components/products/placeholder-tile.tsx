/**
 * Branded fallback shown when a product has no photo yet.
 * Warm brown gradient with a gold leaf mark + the product name — so an
 * admin-added product without an upload still looks on-brand.
 */
export function PlaceholderTile({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_20%,#3a2817,#201610_70%)] p-4 text-center">
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-gold/80" fill="none" aria-hidden>
        <path
          d="M12 3c3.5 2 5 4.5 5 8a5 5 0 0 1-10 0c0-3.5 1.5-6 5-8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M12 7v9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="line-clamp-2 font-heading text-sm font-semibold text-gold-soft">
        {name}
      </span>
      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-on-dark/40">Nuts &amp; More</span>
    </div>
  );
}
