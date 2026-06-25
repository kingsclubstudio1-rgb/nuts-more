import { Container } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-32 text-center">
      <span className="font-heading text-7xl font-semibold text-primary">404</span>
      <h1 className="mt-4 font-heading text-3xl font-semibold text-foreground">
        This page went nutty
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        We couldn&apos;t find what you were looking for — but there are plenty of tasty treats
        waiting back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Back to home</Button>
        <Button href="/products" variant="outline">
          Browse products
        </Button>
      </div>
    </Container>
  );
}
