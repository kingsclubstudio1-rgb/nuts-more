import { Container } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Squirrel, Makhana, Sparkle } from "@/components/graphics/doodles";

export function CtaBand() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-accent px-7 py-14 text-center text-accent-foreground sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl animate-float" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
          <Makhana className="pointer-events-none absolute left-8 bottom-8 hidden h-14 w-14 text-white/20 animate-bob sm:block" />
          <Sparkle className="pointer-events-none absolute right-10 top-10 h-8 w-8 text-white/40 animate-bob" />
          <Squirrel className="pointer-events-none absolute right-6 bottom-0 hidden h-28 w-28 text-white/15 sm:block" />
          <div className="relative">
            <p className="font-script text-2xl text-white/90 sm:text-3xl">Healthy eats, tasty treats</p>
            <h2 className="mx-auto mt-2 max-w-2xl font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Premium goodness, delivered to your door
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-accent-foreground/85">
              Free shipping on orders over ₹999. Fresh batches, every single week.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/products" variant="primary" size="lg">Start shopping</Button>
              <Button href="/bulk" variant="soft" size="lg"
                className="border-white/30 bg-white/15 text-accent-foreground hover:bg-white/25">
                Order in bulk
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
