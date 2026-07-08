import { cn } from "@/lib/utils";

export function Heading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-gold",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-6 bg-gold/60" />
          {eyebrow}
          <span className="h-px w-6 bg-gold/60" />
        </p>
      )}
      <h2
        className={cn(
          "mt-3 font-heading text-3xl font-bold leading-tight sm:text-4xl",
          dark ? "text-on-dark" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-3 text-base leading-relaxed",
            dark ? "text-muted-on-dark" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
