import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  Bestseller: "bg-accent text-accent-foreground",
  New: "bg-brown text-primary-foreground",
  Limited: "bg-[#8a6d3b] text-white",
  default: "bg-white/80 text-brown-ink",
};

export function Badge({
  children,
  tone = "default",
  className,
}: {
  children: React.ReactNode;
  tone?: keyof typeof styles | string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-sm",
        styles[tone] ?? styles.default,
        className
      )}
    >
      {children}
    </span>
  );
}
