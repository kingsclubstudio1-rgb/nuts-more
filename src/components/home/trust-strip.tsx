import { Leaf, Award, HeartPulse, PackageCheck } from "lucide-react";

const ITEMS = [
  { icon: Leaf, title: "Hand-picked", sub: "Carefully sorted for quality" },
  { icon: Award, title: "Premium Quality", sub: "Carefully selected for the best taste" },
  { icon: HeartPulse, title: "Rich In Nutrition", sub: "A good source of energy & health" },
  { icon: PackageCheck, title: "Hygienically Packed", sub: "Packed with care & freshness" },
];

export function TrustStrip() {
  return (
    <section className="border-y border-white/10 bg-espresso-2 text-on-dark">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:grid-cols-4 lg:divide-x lg:divide-white/10 lg:gap-0 lg:px-8">
        {ITEMS.map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 lg:justify-center lg:px-4">
            <Icon className="h-8 w-8 shrink-0 text-gold" strokeWidth={1.4} />
            <div>
              <p className="text-sm font-bold text-on-dark">{title}</p>
              <p className="text-xs leading-tight text-muted-on-dark">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
