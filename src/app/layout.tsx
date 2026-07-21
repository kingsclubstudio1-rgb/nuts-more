import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nuts-and-more.store"),
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-background">{children}</body>
    </html>
  );
}
