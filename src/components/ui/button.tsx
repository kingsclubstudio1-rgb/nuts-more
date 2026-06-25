import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-wide transition-all duration-200 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-brown-ink hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5",
        accent:
          "bg-accent text-accent-foreground shadow-[var(--shadow-soft)] hover:bg-accent-ink hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5",
        outline:
          "border-2 border-primary/25 text-primary bg-transparent hover:bg-brown-soft hover:border-primary/40",
        ghost: "text-foreground hover:bg-brown-soft",
        soft: "bg-surface text-foreground border border-border hover:bg-cream-deep",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[0.95rem]",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type CommonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps & { href: string };

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { className, variant, size, children } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if ("href" in props && props.href) {
    const { href } = props;
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} className={classes} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, className: _c, children: _ch, href: _h, ...rest } =
    props as ButtonAsButton;
  void _v; void _s; void _c; void _ch; void _h;
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

export { buttonVariants };
