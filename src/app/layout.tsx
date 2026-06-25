import type { Metadata } from "next";
import { Fredoka, Nunito, Pacifico } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nutsandmore.store"),
  title: {
    default: "Nuts & More — Premium Gourmet Dates, Dry Fruits & Nuts",
    template: "%s · Nuts & More",
  },
  description:
    "Premium, health-conscious gourmet dates, dry fruits, nuts, seeds & makhana — plus bespoke corporate gifting. Hand-picked with care and love since 2019.",
  openGraph: {
    title: "Nuts & More — Premium Gourmet Excellence",
    description:
      "Premium dates, dry fruits, nuts, seeds & makhana, plus bespoke corporate gifting.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} ${pacifico.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
