import { SITE } from "./site";

export type Policy = {
  slug: string;
  title: string;
  updated: string;
  intro: string;
  sections: { heading: string; body: string[] }[];
};

const contact = `${SITE.email} · ${SITE.phone}`;

export const POLICIES: Record<string, Policy> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    updated: "July 2026",
    intro: `${SITE.legal} ("we", "us") respects your privacy. This policy explains what information we collect when you use ${SITE.web}, and how we use and protect it.`,
    sections: [
      {
        heading: "Information we collect",
        body: [
          "Account details you provide: full name, mobile number, email address and password.",
          "Order and delivery details: shipping address, items ordered and payment status (payments are processed by our secure payment partner; we do not store card details).",
          "Technical data: basic usage and device information to keep the site secure and working well.",
        ],
      },
      {
        heading: "How we use your information",
        body: [
          "To create and manage your account and process, pack and deliver your orders.",
          "To send order confirmations, delivery updates and, if you opt in, occasional offers.",
          "To provide customer support and to improve our products and service.",
        ],
      },
      {
        heading: "Sharing",
        body: [
          "We share information only with the partners needed to run the store — our delivery partners, and our payment gateway and hosting/database providers — under appropriate confidentiality obligations. We never sell your personal data.",
        ],
      },
      {
        heading: "Data security & your rights",
        body: [
          "Your data is stored securely and access is restricted. You may request access, correction or deletion of your data at any time.",
          `To exercise any of these rights or ask a question, contact us at ${contact}.`,
        ],
      },
    ],
  },
  returns: {
    slug: "returns",
    title: "Return & Refund Policy",
    updated: "July 2026",
    intro:
      "Because our products are food items, we can only accept returns in specific cases below. We stand fully behind the quality of every order.",
    sections: [
      {
        heading: "Eligible returns",
        body: [
          "If your order arrives damaged, defective, or you receive the wrong item, contact us within 48 hours of delivery with your order number and clear photographs.",
          "Once verified, we will arrange a free replacement or a full refund of the affected item(s).",
        ],
      },
      {
        heading: "Non-returnable items",
        body: [
          "For hygiene and food-safety reasons, opened, used or partially consumed products cannot be returned unless they were damaged or defective on arrival.",
          "Requests raised after 48 hours of delivery may not be eligible.",
        ],
      },
      {
        heading: "Refunds",
        body: [
          "Approved refunds are processed to your original payment method within 5–7 business days.",
          `For any return or refund request, reach us at ${contact}.`,
        ],
      },
    ],
  },
  shipping: {
    slug: "shipping",
    title: "Shipping & Delivery Policy",
    updated: "July 2026",
    intro: "We deliver premium dates, dry fruits and nuts across India, packed hygienically and dispatched fresh.",
    sections: [
      {
        heading: "Dispatch & delivery time",
        body: [
          "Orders are typically packed and dispatched within 1–2 business days.",
          "Delivery usually takes 2–7 business days depending on your location. You will receive tracking details once your order ships.",
        ],
      },
      {
        heading: "Shipping charges",
        body: [
          "Orders of ₹699 and above within Bangalore Urban District ship free.",
          "Orders below ₹699 carry a shipping charge of ₹100.",
          "For delivery addresses outside Bangalore Urban District, a shipping charge of ₹150 applies irrespective of order value.",
          "The exact shipping charge is calculated and shown automatically at checkout.",
        ],
      },
      {
        heading: "Order tracking & issues",
        body: [
          `If your order is delayed or you have any delivery question, contact us at ${contact}.`,
        ],
      },
    ],
  },
  terms: {
    slug: "terms",
    title: "Terms & Conditions",
    updated: "July 2026",
    intro: `By using ${SITE.web} and placing an order, you agree to the following terms.`,
    sections: [
      {
        heading: "Orders & pricing",
        body: [
          "All prices are in Indian Rupees (₹) and inclusive of applicable taxes unless stated otherwise.",
          "We make every effort to display accurate prices, product details and availability; in the rare event of an error, we may cancel or correct the affected order and refund any amount paid.",
        ],
      },
      {
        heading: "Payments",
        body: [
          "Payments are processed securely through our payment gateway. Your order is confirmed once payment is successfully received.",
        ],
      },
      {
        heading: "Product information",
        body: [
          "Product images are for representation. Nutritional values shown are typical/indicative and may vary naturally between batches.",
          "Please check the ingredients if you have any allergies; our products may contain or be processed alongside tree nuts.",
        ],
      },
      {
        heading: "Contact",
        body: [`For any questions about these terms, contact ${contact}.`],
      },
    ],
  },
};

export const POLICY_LINKS = [
  { label: "Privacy Policy", href: "/policies/privacy" },
  { label: "Return & Refund", href: "/policies/returns" },
  { label: "Shipping & Delivery", href: "/policies/shipping" },
  { label: "Terms & Conditions", href: "/policies/terms" },
];
