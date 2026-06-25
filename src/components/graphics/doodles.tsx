import { cn } from "@/lib/utils";

type DoodleProps = { className?: string };

/* ---------------- Mascot: cute chibi squirrel holding an acorn ------------ */
export function Squirrel({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      {/* big fluffy curling tail */}
      <path
        d="M46 106C14 104 2 70 14 44 24 22 50 16 60 30c6 9 2 20-9 20-9 0-15 8-13 17 1 6 6 11 13 12-7 9-15 13-19 15Z"
        fill="currentColor"
      />
      <path
        d="M30 92C18 74 20 50 38 38"
        stroke="#fff7ec"
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* body */}
      <ellipse cx="68" cy="84" rx="24" ry="26" fill="currentColor" />
      {/* belly */}
      <ellipse cx="66" cy="88" rx="14" ry="18" fill="#fff7ec" opacity="0.9" />
      {/* feet */}
      <ellipse cx="56" cy="108" rx="7" ry="4.5" fill="currentColor" />
      <ellipse cx="82" cy="108" rx="7" ry="4.5" fill="currentColor" />
      {/* head (big & round for chibi cuteness) */}
      <circle cx="80" cy="44" r="22" fill="currentColor" />
      {/* ears */}
      <path d="M64 26c-3-11 7-15 13-7-7 0-11 3-13 7Z" fill="currentColor" />
      <path d="M96 26c3-11-7-15-13-7 7 0 11 3 13 7Z" fill="currentColor" />
      <path d="M66 25c-1-5 3-7 6-4-3 0-5 2-6 4Z" fill="#c98a3a" opacity="0.8" />
      {/* cheeks */}
      <circle cx="68" cy="50" r="5" fill="#e89b9b" opacity="0.5" />
      <circle cx="92" cy="50" r="5" fill="#e89b9b" opacity="0.5" />
      {/* muzzle */}
      <ellipse cx="80" cy="52" rx="11" ry="8" fill="#fff7ec" opacity="0.92" />
      {/* eyes */}
      <circle cx="73" cy="42" r="4" fill="#2f2118" />
      <circle cx="74.4" cy="40.6" r="1.3" fill="#fff" />
      <circle cx="89" cy="42" r="4" fill="#2f2118" />
      <circle cx="90.4" cy="40.6" r="1.3" fill="#fff" />
      {/* nose + smile */}
      <ellipse cx="81" cy="50" rx="2.6" ry="2" fill="#2f2118" />
      <path d="M81 52c0 3-3 4-5 3M81 52c0 3 3 4 5 3" stroke="#2f2118" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {/* paws holding acorn */}
      <ellipse cx="64" cy="98" rx="6" ry="5" fill="currentColor" />
      <ellipse cx="78" cy="98" rx="6" ry="5" fill="currentColor" />
      <ellipse cx="71" cy="96" rx="7" ry="6" fill="#d29a4e" />
      <path d="M63 92h16a2.5 2.5 0 0 1 2.5 2.5h-21A2.5 2.5 0 0 1 63 92Z" fill="#7a5126" />
      <path d="M71 86v6" stroke="#7a5126" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Squirrel waving hello (standing) ---------------- */
export function SquirrelWave({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      {/* tail */}
      <path d="M40 110C12 106 4 74 16 50 25 30 48 24 58 36c6 8 2 18-8 18-9 0-15 8-13 17 1 7 8 13 16 12-8 9-20 16-29 15Z" fill="currentColor" />
      <path d="M30 96C20 78 22 56 38 44" stroke="#fff7ec" strokeWidth="3.2" strokeLinecap="round" opacity="0.45" />
      {/* body standing */}
      <ellipse cx="66" cy="86" rx="20" ry="24" fill="currentColor" />
      <ellipse cx="65" cy="90" rx="11" ry="15" fill="#fff7ec" opacity="0.9" />
      {/* feet */}
      <ellipse cx="56" cy="108" rx="6" ry="4" fill="currentColor" />
      <ellipse cx="78" cy="108" rx="6" ry="4" fill="currentColor" />
      {/* lower waving arm origin */}
      <path d="M82 74c10-6 18-14 20-26" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
      <circle cx="104" cy="44" r="6" fill="currentColor" />
      {/* head */}
      <circle cx="64" cy="46" r="20" fill="currentColor" />
      <path d="M50 30c-3-10 6-14 12-7-6 0-10 3-12 7Z" fill="currentColor" />
      <path d="M78 30c3-10-6-14-12-7 6 0 10 3 12 7Z" fill="currentColor" />
      <circle cx="54" cy="52" r="4.5" fill="#e89b9b" opacity="0.5" />
      <ellipse cx="64" cy="53" rx="10" ry="7" fill="#fff7ec" opacity="0.92" />
      <circle cx="58" cy="44" r="3.6" fill="#2f2118" />
      <circle cx="59.2" cy="42.8" r="1.2" fill="#fff" />
      <circle cx="72" cy="44" r="3.6" fill="#2f2118" />
      <circle cx="73.2" cy="42.8" r="1.2" fill="#fff" />
      <ellipse cx="65" cy="51" rx="2.4" ry="1.8" fill="#2f2118" />
      <path d="M65 53c0 3-3 4-5 3M65 53c0 3 3 4 5 3" stroke="#2f2118" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Squirrel peeking over an edge ---------------- */
export function SquirrelPeek({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 90" className={className} fill="none" aria-hidden="true">
      {/* ears */}
      <path d="M40 30c-3-12 8-16 14-8-7 0-11 4-14 8Z" fill="currentColor" />
      <path d="M80 30c3-12-8-16-14-8 7 0 11 4 14 8Z" fill="currentColor" />
      {/* head */}
      <circle cx="60" cy="44" r="26" fill="currentColor" />
      <circle cx="44" cy="52" r="6" fill="#e89b9b" opacity="0.5" />
      <circle cx="76" cy="52" r="6" fill="#e89b9b" opacity="0.5" />
      <ellipse cx="60" cy="54" rx="13" ry="9" fill="#fff7ec" opacity="0.92" />
      <circle cx="51" cy="42" r="4.6" fill="#2f2118" />
      <circle cx="52.4" cy="40.4" r="1.4" fill="#fff" />
      <circle cx="69" cy="42" r="4.6" fill="#2f2118" />
      <circle cx="70.4" cy="40.4" r="1.4" fill="#fff" />
      <ellipse cx="60" cy="52" rx="3" ry="2.3" fill="#2f2118" />
      <path d="M60 54.5c0 3.5-4 4.5-6 3.5M60 54.5c0 3.5 4 4.5 6 3.5" stroke="#2f2118" strokeWidth="1.4" strokeLinecap="round" />
      {/* paws gripping the edge */}
      <path d="M30 74c0-5 5-8 10-8s9 4 9 9H30Z" fill="currentColor" />
      <path d="M71 75c0-5 4-9 9-9s10 3 10 8H71Z" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Makhana / foxnut puff ---------------- */
export function Makhana({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <path
        d="M24 4c8 2 14 6 16 14 3 11-4 22-16 26C12 40 5 29 8 18 10 10 16 6 24 4Z"
        fill="currentColor"
      />
      <circle cx="19" cy="20" r="2" fill="#fff7ec" opacity="0.6" />
      <circle cx="28" cy="26" r="2.4" fill="#fff7ec" opacity="0.55" />
      <circle cx="23" cy="32" r="1.6" fill="#fff7ec" opacity="0.5" />
      <path d="M24 4c-6 8-6 28 0 40" stroke="#fff7ec" strokeWidth="1.6" opacity="0.5" />
    </svg>
  );
}

/* ---------------- Almond ---------------- */
export function Almond({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 56" className={className} fill="none" aria-hidden="true">
      <path d="M20 2c12 8 16 26 9 40-3 6-6 10-9 12-3-2-6-6-9-12-7-14-3-32 9-40Z" fill="currentColor" />
      <path d="M20 8c0 14 0 30 0 42" stroke="#fff7ec" strokeWidth="1.4" opacity="0.45" />
    </svg>
  );
}

/* ---------------- Cashew ---------------- */
export function Cashew({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 56 44" className={className} fill="none" aria-hidden="true">
      <path
        d="M8 14C2 26 12 40 26 40c10 0 16-6 22-12-6 2-12 0-14-6-3-9-12-14-20-10-3 1-5 1-6 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ---------------- Leaf ---------------- */
export function Leaf({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 40 48" className={className} fill="none" aria-hidden="true">
      <path d="M20 2C6 10 2 30 12 44c4 2 12 2 16-2 10-12 6-32-8-40Z" fill="currentColor" />
      <path d="M18 8c0 12 0 26-2 36" stroke="#fff7ec" strokeWidth="1.4" opacity="0.5" />
      <path d="M16 18l-6-3M17 28l-7-3M18 36l-6-2" stroke="#fff7ec" strokeWidth="1.2" opacity="0.4" />
    </svg>
  );
}

/* ---------------- Lotus flower (makhana grows on lotus) ---------------- */
export function Lotus({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 64 48" className={className} fill="none" aria-hidden="true">
      <path d="M32 8c5 8 5 22 0 32-5-10-5-24 0-32Z" fill="currentColor" />
      <path d="M32 40C24 34 16 30 8 32c2 8 12 12 24 8Z" fill="currentColor" opacity="0.85" />
      <path d="M32 40c8-6 16-10 24-8-2 8-12 12-24 8Z" fill="currentColor" opacity="0.85" />
      <path d="M32 40C26 30 18 24 10 24c-2 8 6 18 22 16Z" fill="currentColor" opacity="0.7" />
      <path d="M32 40c6-10 14-16 22-16 2 8-6 18-22 16Z" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

/* ---------------- Sparkle ---------------- */
export function Sparkle({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 2c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10Z" fill="currentColor" />
    </svg>
  );
}

/* ---------------- Floating doodle field ----------------
 * Scatters cute nuts/leaves/sparkles across a section background.
 * Parent must be `relative` (and usually `overflow-hidden`).
 * variant "light"  → pastel doodles for cream/light sections
 * variant "soft"   → white doodles for coloured / dark bands               */
export function FloatingDoodles({
  variant = "light",
  className = "inset-0",
}: {
  variant?: "light" | "soft";
  className?: string;
}) {
  const c =
    variant === "soft"
      ? { a: "text-white/15", b: "text-white/10", c: "text-white/20", d: "text-white/15", e: "text-white/25" }
      : { a: "text-butter", b: "text-mint", c: "text-sky", d: "text-peach", e: "text-accent/30" };
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute overflow-hidden", className)}>
      <Almond className={`absolute left-[4%] top-[16%] h-12 w-12 rotate-12 ${c.a} animate-float`} />
      <Sparkle className={`absolute left-[20%] top-[66%] h-8 w-8 ${c.e} animate-bob`} />
      <Cashew className={`absolute right-[5%] top-[24%] h-14 w-14 -rotate-12 ${c.b} animate-float-slow`} />
      <Makhana className={`absolute right-[16%] top-[70%] h-11 w-11 ${c.c} animate-float`} />
      <Leaf className={`absolute left-[45%] top-[10%] h-10 w-10 -rotate-12 ${c.d} animate-sway`} />
      <Sparkle className={`absolute right-[38%] bottom-[14%] h-7 w-7 ${c.e} animate-bob`} />
      <Makhana className={`absolute left-[9%] bottom-[18%] h-10 w-10 ${c.a} animate-float-slow`} />
    </div>
  );
}

/* ---------------- Wavy section divider ----------------
 * Sits at the boundary between two sections. `color` should match the
 * section BELOW it; place at the bottom of the upper section.            */
export function WaveDivider({
  color = "var(--cream)",
  className,
  flip = false,
  variant = "round",
}: {
  color?: string;
  className?: string;
  flip?: boolean;
  variant?: "round" | "scallop";
}) {
  // Solid block with a single wavy bottom hem (no flat transparent band).
  // Place at the TOP of a section (fill = colour of the section ABOVE) to
  // transition into it; add `flip` at the BOTTOM (fill = colour BELOW).
  const d =
    variant === "scallop"
      ? "M0 0 H1440 V40 Q 1350 80 1260 40 T 1080 40 T 900 40 T 720 40 T 540 40 T 360 40 T 180 40 T 0 40 Z"
      : "M0 0 H1440 V70 C 1200 116 960 116 720 78 C 480 40 240 40 0 70 Z";
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none w-full overflow-hidden leading-[0]", className)}
      style={{ transform: flip ? "rotate(180deg)" : undefined }}
    >
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-[60px] w-full sm:h-[90px]">
        <path d={d} fill={color} />
      </svg>
    </div>
  );
}
