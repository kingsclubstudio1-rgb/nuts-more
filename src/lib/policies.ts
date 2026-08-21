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
      "At Nuts and More, we are committed to delivering fresh, high-quality products. As our products are perishable food items, we generally do not accept returns or exchanges once an order has been delivered.",
    sections: [
      {
        heading: "Damaged, defective, or incorrect products",
        body: [
          "If you receive a damaged, defective, or incorrect product, please contact us within 24 hours of delivery by sharing your order number along with clear photographs of the product and its packaging.",
          "We will review the issue and, where applicable, arrange for a replacement or refund.",
        ],
      },
      {
        heading: "Return requests",
        body: [
          "Return requests for reasons other than damaged, defective, or incorrect products will be considered only in exceptional circumstances and at our sole discretion.",
          "Approval is subject to product condition, location, and feasibility of return pickup.",
        ],
      },
      {
        heading: "Return pickup charges",
        body: [
          "If a return request is approved for reasons other than our error, a nominal return pickup and handling charge may apply. The applicable charges will be communicated to you before the return is processed.",
        ],
      },
      {
        heading: "Contact us",
        body: [
          `For any queries regarding your order, please contact our customer support at ${contact}.`,
        ],
      },
    ],
  },
  shipping: {
    slug: "shipping",
    title: "Shipping & Delivery Policy",
    updated: "July 2026",
    intro:
      "At Nuts and More, we are committed to delivering fresh, premium-quality dry fruits and healthy snacks safely and on time. Every order is carefully packed to maintain product quality throughout transit.",
    sections: [
      {
        heading: "Order processing",
        body: [
          "Orders are processed within 1–2 business days after payment confirmation.",
          "Orders placed on Sundays or public holidays will be processed on the next business day.",
          "During festivals, promotional sales, or unforeseen circumstances, processing may take slightly longer.",
        ],
      },
      {
        heading: "Delivery timeline",
        body: [
          "Metro Cities: 2–5 business days.",
          "Other Cities & Towns: 3–7 business days.",
          "Remote Locations: 5–10 business days.",
          "Delivery timelines are estimates and may vary depending on courier service availability, weather conditions, public holidays, or other unforeseen events.",
        ],
      },
      {
        heading: "Shipping charges",
        body: [
          "Enjoy free delivery on all orders above ₹999 within Bangalore Urban District.",
          "For orders below ₹999, a delivery charge of ₹100 applies.",
          "For delivery addresses outside Bangalore Urban District, a charge of ₹150 applies. The exact shipping charge is always calculated and shown at checkout before payment.",
          "We may also offer free shipping on eligible orders or during promotional campaigns.",
        ],
      },
      {
        heading: "Order tracking",
        body: [
          "Once your order has been shipped, you will receive the tracking details via SMS, WhatsApp, or Email (where applicable), allowing you to track your shipment until delivery.",
        ],
      },
      {
        heading: "Delivery",
        body: [
          "Our courier partners will make reasonable attempts to deliver your order to the address provided during checkout. To avoid delays, please ensure that your shipping address, contact number, and PIN code are accurate.",
          "If delivery cannot be completed due to an incorrect address, recipient unavailability, or refusal to accept the shipment, the order may be returned to us. Additional shipping charges may apply for re-dispatch.",
        ],
      },
      {
        heading: "Damaged or tampered packages",
        body: [
          "Please inspect the package before accepting delivery. If the package is visibly damaged, you may refuse to accept it.",
          "If the damage is noticed after delivery, please contact us within 24 hours and share clear photographs of the product and packaging. We will review the issue and provide an appropriate resolution.",
        ],
      },
      {
        heading: "Order cancellation",
        body: [
          "To cancel an order, contact us on WhatsApp or email as soon as possible with your order number. Cancellations can only be accepted while the order has not yet been dispatched — once it has shipped, it cannot be cancelled, and you may instead refer to our Return & Refund Policy.",
          "Approved cancellations are refunded to the original payment method, usually within 5-7 working days.",
        ],
      },
      {
        heading: "Shipping locations",
        body: [
          "We currently deliver across India through our trusted logistics partners.",
          `For bulk orders, corporate gifting, or export enquiries, please contact our customer support at ${contact}.`,
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
