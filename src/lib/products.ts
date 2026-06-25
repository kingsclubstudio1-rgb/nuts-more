import { img } from "./utils";

export type CategorySlug =
  | "nuts"
  | "dry-fruits"
  | "seeds"
  | "makhana"
  | "trail-muesli"
  | "gift-hampers";

export type Tint = "blush" | "peach" | "butter" | "mint" | "sky" | "lavender";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  tint: Tint;
  imageId: string;
};

export type Product = {
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  weight: string;
  rating: number;
  reviews: number;
  blurb: string;
  imageId: string;
  badge?: "Bestseller" | "New" | "Limited";
};

export const TINT_HEX: Record<Tint, string> = {
  blush: "var(--blush)",
  peach: "var(--peach)",
  butter: "var(--butter)",
  mint: "var(--mint)",
  sky: "var(--sky)",
  lavender: "var(--lavender)",
};

export const CATEGORIES: Category[] = [
  {
    slug: "nuts",
    name: "Nuts",
    tagline: "The wholesome classics",
    description:
      "Hand-picked almonds, cashews, pistachios, walnuts and more — from premier global orchards.",
    tint: "butter",
    imageId: "assorted nuts bowl|140",
  },
  {
    slug: "dry-fruits",
    name: "Dry Fruits",
    tagline: "Nature's sweet jewels",
    description:
      "Plump Medjool dates, juicy raisins and tangy berries — dried slow to keep the goodness in.",
    tint: "blush",
    imageId: "dried fruits assortment|141",
  },
  {
    slug: "seeds",
    name: "Seeds",
    tagline: "Tiny but mighty",
    description:
      "Chia, pumpkin, sunflower, flax and basil — the everyday superfoods your bowl will love.",
    tint: "mint",
    imageId: "seeds assortment bowl|142",
  },
  {
    slug: "makhana",
    name: "Makhana",
    tagline: "A delightful crunch",
    description:
      "Roasted foxnuts in fun, moreish flavours — the guilt-free snack for a healthy you.",
    tint: "sky",
    imageId: "fox nuts makhana|143",
  },
  {
    slug: "trail-muesli",
    name: "Trail Mix & Muesli",
    tagline: "Fuel for every day",
    description:
      "Energising trail mixes and wholesome muesli for breakfasts, desks and adventures.",
    tint: "peach",
    imageId: "trail mix nuts|144",
  },
  {
    slug: "gift-hampers",
    name: "Gift Hampers",
    tagline: "Gifting, perfected",
    description:
      "Bespoke gourmet hampers that turn dates, nuts and dry fruits into unforgettable moments.",
    tint: "lavender",
    imageId: "gift hamper luxury|145",
  },
];

export const PRODUCTS: Product[] = [
  // Nuts
  { slug: "almonds-regular", name: "California Almonds", category: "nuts", price: 549, weight: "500 g", rating: 4.8, reviews: 312, blurb: "Crunchy, sweet and skin-on for maximum fibre.", imageId: "almonds|101", badge: "Bestseller" },
  { slug: "almonds-roasted", name: "Roasted & Salted Almonds", category: "nuts", price: 599, weight: "500 g", rating: 4.7, reviews: 142, blurb: "Dry-roasted with a whisper of sea salt.", imageId: "roasted almonds|102" },
  { slug: "cashews-classic", name: "Cashews W240 (Classic)", category: "nuts", price: 699, weight: "500 g", rating: 4.8, reviews: 221, blurb: "Buttery, jumbo, lightly roasted kernels.", imageId: "cashew nuts|103", badge: "Bestseller" },
  { slug: "cashews-peri-peri", name: "Peri Peri Cashews", category: "nuts", price: 449, weight: "250 g", rating: 4.7, reviews: 168, blurb: "Fiery, tangy and impossible to put down.", imageId: "spiced cashew nuts|104" },
  { slug: "cashews-masala", name: "Spicy Masala Cashews", category: "nuts", price: 449, weight: "250 g", rating: 4.6, reviews: 119, blurb: "Roasted cashews in a warm Indian masala.", imageId: "masala nuts|105" },
  { slug: "pistachios", name: "Roasted Pistachios", category: "nuts", price: 899, weight: "500 g", rating: 4.9, reviews: 254, blurb: "Plump, jade-green Californian kernels.", imageId: "pistachios|106", badge: "Bestseller" },
  { slug: "walnuts", name: "California Walnut Kernels", category: "nuts", price: 749, weight: "400 g", rating: 4.6, reviews: 121, blurb: "Light halves, full of omega-3 goodness.", imageId: "walnuts|107" },
  { slug: "hazelnuts", name: "Hazelnuts", category: "nuts", price: 799, weight: "400 g", rating: 4.6, reviews: 64, blurb: "Sweet, aromatic and gloriously crunchy.", imageId: "hazelnuts|108" },
  { slug: "pecans", name: "Pecan Nuts", category: "nuts", price: 949, weight: "400 g", rating: 4.7, reviews: 51, blurb: "Rich, buttery halves for baking & snacking.", imageId: "pecan nuts|109", badge: "New" },
  { slug: "macadamia", name: "Macadamia Nuts", category: "nuts", price: 1199, weight: "400 g", rating: 4.8, reviews: 47, blurb: "Creamy, indulgent and oh-so-luxurious.", imageId: "macadamia nuts|110" },

  // Dry fruits
  { slug: "medjool-dates", name: "Jumbo Medjool Dates", category: "dry-fruits", price: 599, weight: "500 g", rating: 4.9, reviews: 408, blurb: "Soft, caramel-rich and naturally sweet.", imageId: "medjool dates|111", badge: "Bestseller" },
  { slug: "mabroom-dates", name: "Mabroom Dates", category: "dry-fruits", price: 549, weight: "400 g", rating: 4.7, reviews: 96, blurb: "Chewy, mildly sweet and full of fibre.", imageId: "dates fruit|112" },
  { slug: "green-raisins", name: "Long Green Raisins", category: "dry-fruits", price: 379, weight: "500 g", rating: 4.6, reviews: 134, blurb: "Tart, seedless and sun-kissed.", imageId: "raisins|113" },
  { slug: "munakka-raisins", name: "Munakka Raisins", category: "dry-fruits", price: 399, weight: "500 g", rating: 4.5, reviews: 88, blurb: "Large, juicy raisins with a deep sweetness.", imageId: "black raisins|114" },
  { slug: "dried-blueberries", name: "Dried Blueberries", category: "dry-fruits", price: 549, weight: "200 g", rating: 4.7, reviews: 73, blurb: "Antioxidant-rich bursts of berry.", imageId: "dried blueberries|115", badge: "New" },
  { slug: "dried-cranberries", name: "Dried Cranberries", category: "dry-fruits", price: 449, weight: "250 g", rating: 4.6, reviews: 112, blurb: "Sweet-tart ruby gems for bowls and bakes.", imageId: "dried cranberries|116" },
  { slug: "dried-kiwi", name: "Dried Kiwi", category: "dry-fruits", price: 399, weight: "200 g", rating: 4.5, reviews: 41, blurb: "Tangy, chewy and irresistibly green.", imageId: "dried kiwi|117" },
  { slug: "dried-pineapple", name: "Dried Pineapple", category: "dry-fruits", price: 399, weight: "200 g", rating: 4.5, reviews: 38, blurb: "Tropical sunshine in every bite.", imageId: "dried pineapple|118" },

  // Seeds
  { slug: "chia-seeds", name: "Chia Seeds", category: "seeds", price: 349, weight: "300 g", rating: 4.7, reviews: 211, blurb: "Omega-rich, perfect for puddings & smoothies.", imageId: "chia seeds|119", badge: "Bestseller" },
  { slug: "pumpkin-seeds", name: "Pumpkin Seeds", category: "seeds", price: 329, weight: "250 g", rating: 4.6, reviews: 143, blurb: "Crunchy, lightly roasted, packed with zinc.", imageId: "pumpkin seeds|120" },
  { slug: "sunflower-seeds", name: "Sunflower Seeds", category: "seeds", price: 279, weight: "300 g", rating: 4.5, reviews: 97, blurb: "Mild, nutty and endlessly snackable.", imageId: "sunflower seeds|121" },
  { slug: "flax-seeds", name: "Flax Seeds", category: "seeds", price: 249, weight: "300 g", rating: 4.6, reviews: 84, blurb: "Fibre-rich and fabulous over anything.", imageId: "flax seeds|122" },
  { slug: "basil-seeds", name: "Basil (Sabja) Seeds", category: "seeds", price: 269, weight: "250 g", rating: 4.5, reviews: 62, blurb: "Cooling sabja for sherbets and falooda.", imageId: "basil seeds|123" },
  { slug: "watermelon-seeds", name: "Watermelon Seeds", category: "seeds", price: 299, weight: "250 g", rating: 4.4, reviews: 39, blurb: "Mild, protein-rich kernels to nibble on.", imageId: "seeds bowl|124" },

  // Makhana
  { slug: "makhana-peri-peri", name: "Peri Peri Makhana", category: "makhana", price: 199, weight: "60 g", rating: 4.8, reviews: 276, blurb: "Roasted foxnuts with a fiery peri-peri kick.", imageId: "fox nuts makhana|125", badge: "Bestseller" },
  { slug: "makhana-cheese", name: "Cheese Makhana", category: "makhana", price: 199, weight: "60 g", rating: 4.7, reviews: 158, blurb: "Cheesy, crunchy and totally guilt-free.", imageId: "makhana snack|126" },
  { slug: "makhana-salt-pepper", name: "Salt & Pepper Makhana", category: "makhana", price: 199, weight: "60 g", rating: 4.7, reviews: 142, blurb: "Himalayan salt and cracked black pepper.", imageId: "lotus seeds makhana|127" },
  { slug: "makhana-bbq", name: "Barbeque Makhana", category: "makhana", price: 199, weight: "60 g", rating: 4.6, reviews: 113, blurb: "Smoky barbeque popped foxnuts.", imageId: "foxnuts bowl|128", badge: "New" },
  { slug: "makhana-tomato", name: "Tangy Tomato Makhana", category: "makhana", price: 199, weight: "60 g", rating: 4.6, reviews: 121, blurb: "Zesty tomato tang in every crunch.", imageId: "makhana foxnut|129" },
  { slug: "makhana-raw", name: "Raw Makhana", category: "makhana", price: 299, weight: "100 g", rating: 4.7, reviews: 168, blurb: "Pure popped lotus seeds — roast your own way.", imageId: "popped lotus seeds|130" },

  // Trail mix & muesli
  { slug: "panch-rathan", name: "Panch Rathan Mix", category: "trail-muesli", price: 849, weight: "500 g", rating: 4.8, reviews: 176, blurb: "A royal five-jewel medley of nuts & fruit.", imageId: "mixed nuts dried fruit|131", badge: "Bestseller" },
  { slug: "trail-mix", name: "Trail Mix — Eat & Fit", category: "trail-muesli", price: 449, weight: "250 g", rating: 4.7, reviews: 188, blurb: "Nuts, seeds & dried fruit for the go.", imageId: "trail mix|132" },
  { slug: "muesli-fruit-nut", name: "Fruit & Nut Muesli", category: "trail-muesli", price: 499, weight: "500 g", rating: 4.6, reviews: 94, blurb: "Wholegrain oats, nuts and fruit for breakfast.", imageId: "muesli bowl|133" },
  { slug: "muesli-chocolate", name: "Chocolate Muesli", category: "trail-muesli", price: 529, weight: "500 g", rating: 4.7, reviews: 86, blurb: "Crunchy oats with a chocolatey swirl.", imageId: "chocolate muesli granola|134", badge: "New" },

  // Gift hampers
  { slug: "premium-dry-fruit-gift", name: "Premium Dry Fruit Gift Pack", category: "gift-hampers", price: 1499, weight: "Assorted", rating: 4.9, reviews: 88, blurb: "An elegant box of our finest dry fruits & nuts.", imageId: "dry fruit gift box|135", badge: "Bestseller" },
  { slug: "festive-hamper", name: "Grand Festive Hamper", category: "gift-hampers", price: 2999, weight: "Assorted", rating: 4.9, reviews: 51, blurb: "Our most generous hamper, ribbon-tied.", imageId: "festive gift hamper|136", badge: "Limited" },
  { slug: "wellness-box", name: "Wellness Gift Box", category: "gift-hampers", price: 1799, weight: "Assorted", rating: 4.8, reviews: 64, blurb: "A curated box of seeds, nuts and superfoods.", imageId: "nuts gift box|137" },
  { slug: "corporate-hamper", name: "Corporate Signature Hamper", category: "gift-hampers", price: 2499, weight: "Assorted", rating: 4.9, reviews: 73, blurb: "Custom-branded gifting for clients & teams.", imageId: "corporate gift box|138" },
];

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug);
}
export function productsByCategory(slug: string) {
  return PRODUCTS.filter((p) => p.category === slug);
}
export function featuredProducts() {
  return PRODUCTS.filter((p) => p.badge === "Bestseller");
}

export { img };
