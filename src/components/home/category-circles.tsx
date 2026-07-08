import Image from "next/image";
import Link from "next/link";
import { HOME_CIRCLES } from "@/lib/catalog";

export function CategoryCircles() {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
      {HOME_CIRCLES.map((c) => (
        <Link key={c.label} href={c.href} className="group flex flex-col items-center gap-2.5">
          <span className="relative flex aspect-square w-full max-w-[7rem] items-center justify-center overflow-hidden rounded-full ring-1 ring-line transition-all duration-300 group-hover:ring-2 group-hover:ring-gold">
            <Image
              src={c.image}
              alt={c.label}
              fill
              sizes="120px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </span>
          <span className="text-center">
            <span className="block text-sm font-bold text-foreground group-hover:text-gold-deep">
              {c.label}
            </span>
            <span className="text-xs text-gold-deep">Shop now →</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
