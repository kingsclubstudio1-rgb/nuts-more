/**
 * Scrolling offer marquee — the brand-coloured (brown + gold) take on the
 * client's red offer bars. Pure CSS animation, no client JS.
 */

const OFFERS = [
  "10% OFF on orders above ₹999",
  "15% OFF on orders above ₹2,499",
  "20% OFF on orders above ₹4,999",
  "100% Natural · No Preservatives · Hygienically Packed",
  "Hand-picked with care & love since 2019",
];

function Diamond() {
  return <span className="mx-5 text-[0.6rem] text-[#3a2817]/60">◆</span>;
}

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center whitespace-nowrap"
      aria-hidden={ariaHidden || undefined}
    >
      {OFFERS.map((offer, i) => (
        <span key={i} className="flex items-center">
          <span className="text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[#241606]">
            {offer}
          </span>
          <Diamond />
        </span>
      ))}
    </div>
  );
}

export function OfferMarquee() {
  return (
    <div
      className="group relative overflow-hidden border-b border-[#8a6a2e]/40 bg-[linear-gradient(90deg,#e6c877,#c9a24a_45%,#e6c877)] py-2"
      role="region"
      aria-label="Current offers"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  );
}
