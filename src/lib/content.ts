export const HERO_SLIDES = [
  {
    eyebrow: "Nourishing body & mind",
    title: "A delightful crunch\nwith endless benefits",
    body: "Premium dates, dry fruits, nuts and roasted makhana — hand-picked with care and love since 2019.",
    imageId: "assorted nuts flatlay|150",
    tint: "butter",
    ctaHref: "/products",
    ctaLabel: "Explore the range",
  },
  {
    eyebrow: "Nature's sweet jewels",
    title: "Dates worth\nslowing down for",
    body: "Plump Medjool, rich Mabroom and a rainbow of dry fruits from the world's finest groves.",
    imageId: "medjool dates bowl|151",
    tint: "blush",
    ctaHref: "/products/dry-fruits",
    ctaLabel: "Discover dry fruits",
  },
  {
    eyebrow: "Gifting, perfected",
    title: "Hampers that\nsay it better",
    body: "Bespoke gourmet hampers for the people and partners who matter most.",
    imageId: "gift hamper luxury|152",
    tint: "lavender",
    ctaHref: "/corporate-gifting",
    ctaLabel: "Corporate gifting",
  },
];

export type Benefit = {
  title: string;
  body: string;
  icon: "leaf" | "heart" | "zap" | "sparkles" | "shield" | "brain" | "bone" | "scale";
};

export const BENEFITS: Benefit[] = [
  { icon: "leaf", title: "Rich in Nutrients", body: "A versatile super-food, offering a treasure-trove of health benefits." },
  { icon: "shield", title: "Rich in Antioxidants", body: "Helps fight free radicals and keeps you glowing from within." },
  { icon: "heart", title: "Supports Heart Health", body: "Good fats and fibre that look after your heart." },
  { icon: "scale", title: "Aids Weight Loss", body: "Light, low-calorie snacking that keeps cravings in check." },
];

// Real clients drawn from the company profile
export const BRANDS = [
  "Toyota",
  "LIC",
  "HAL",
  "MFAR",
  "Presidency",
  "Hero",
  "PES University",
  "Alva's",
  "NALAPAD",
  "MSIL",
];

export type Testimonial = { quote: string; name: string; role: string; product: string };

export const TESTIMONIALS: Testimonial[] = [
  { quote: "Thank you for the delicious makhana — it's the perfect crunchy snack and my kids absolutely love it. In fact, we had to reorder just for them!", name: "Pragati Tandon", role: "Verified buyer", product: "Cream & Onion Makhana" },
  { quote: "We've moved our entire Diwali client gifting to Nuts & More. Premium, beautifully packed and always on time.", name: "Rahul Mehta", role: "Procurement, MFAR", product: "Corporate Hamper" },
  { quote: "Freshest pistachios and Medjool dates I've had in years. You can genuinely taste the difference.", name: "Anjali Verma", role: "Home chef & regular", product: "Premium Dry Fruit Pack" },
  { quote: "Reliable bulk supply for our café, consistent quality every single carton. A partner we trust.", name: "Karan Shah", role: "Owner, Brew & Co.", product: "Bulk Trail Mix" },
];

export type CaseStudy = {
  slug: string;
  client: string;
  industry: string;
  headline: string;
  result: string;
  stat: string;
  statLabel: string;
  imageId: string;
  tint: "blush" | "peach" | "butter" | "mint" | "sky" | "lavender";
  challenge: string;
  solution: string;
  highlights: string[];
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "corporate-wellness-gifting",
    client: "MNCs & Corporate Houses",
    industry: "Bespoke Wellness Gifts",
    headline: "Employee engagement & brand loyalty",
    result:
      "Custom-branded wellness hampers delivered across offices nationwide — building goodwill with every box.",
    stat: "50+",
    statLabel: "corporate partners",
    imageId: "corporate gift box|158",
    tint: "lavender",
    challenge:
      "Large corporate houses needed a festive and onboarding gift that reflected a premium, health-first brand — at scale, across multiple cities, and on tight festival deadlines.",
    solution:
      "We co-designed bespoke wellness hampers with custom branding, handled sourcing and hygienic packing in-house, and managed multi-city dispatch end-to-end with tracked delivery to every doorstep.",
    highlights: [
      "Fully custom branding, ribbons and handwritten notes",
      "Multi-city delivery managed end-to-end",
      "GST invoicing and dedicated account management",
    ],
  },
  {
    slug: "hospitality-welcome-amenities",
    client: "Hospitality Chains",
    industry: "Bulk Supply & Room Amenities",
    headline: "Guest experience, elevated",
    result:
      "A bespoke date-and-nut welcome amenity now greets premium guests, reinforcing a luxury promise.",
    stat: "Fresh",
    statLabel: "roasted to order",
    imageId: "luxury gift hamper|159",
    tint: "peach",
    challenge:
      "Premium hospitality chains wanted an in-room welcome amenity that felt indulgent yet health-conscious, with reliable bulk supply that never compromised on freshness.",
    solution:
      "We supply roasted-to-order dates and nuts in elegant, brand-aligned packaging on a scheduled cadence, with multi-stage quality checks ensuring identical grade and freshness in every batch.",
    highlights: [
      "Scheduled bulk supply, always fresh",
      "Brand-aligned luxury packaging",
      "Consistent grade across every carton",
    ],
  },
  {
    slug: "institutional-white-label",
    client: "Government & FMCG",
    industry: "Institutional Gifting & White Label",
    headline: "Quality reliability, at scale",
    result:
      "Institutional gifting and white-label supply with professional protocol adherence on every order.",
    stat: "Since '19",
    statLabel: "trusted partner",
    imageId: "gift hamper basket|160",
    tint: "mint",
    challenge:
      "Government bodies and FMCG/e-commerce partners required dependable supply at volume, with strict protocol adherence and the option of white-label packaging.",
    solution:
      "We deliver institutional gifting and white-label supply with documented quality protocols, scalable capacity and professional handling — a partner that performs reliably at any scale.",
    highlights: [
      "White-label / private-label supply",
      "Protocol adherence and documentation",
      "Quality reliability at scale",
    ],
  },
];

export const STATS = [
  { value: "Fresh", label: "Roasted to order" },
  { value: "Premium", label: "Global sourcing" },
  { value: "50+", label: "Corporate partners" },
  { value: "2019", label: "Trusted since" },
];

export const RECIPE_STEPS = [
  { step: "01", tint: "butter", text: "Boil milk and add roasted makhana." },
  { step: "02", tint: "peach", text: "Add saffron soaked in warm milk and sugar." },
  { step: "03", tint: "blush", text: "Boil for 5 minutes until the milk reduces." },
  { step: "04", tint: "sky", text: "Add evaporated milk, powdered cardamom; bring to a boil and switch off." },
  { step: "05", tint: "mint", text: "Serve hot, garnished with dry fruits." },
];
