# Nuts & More — Admin, Accounts & Inventory Guide

## One login page for everyone (`/login`)

There's a single sign-in page (person icon in the header, or "Track Order"):

- **Admin** — signing in with the admin **email + password** routes to the `/admin` inventory dashboard.
  Defaults: email `admin@nutsandmore.store`, password `nutsandmore2019`.
- **Customers** — any other email/password signs in (or signs up) as a shopper and lands on **`/account`**
  with their profile + **purchase history**. (Requires Supabase — see below.)
- Protected pages (`/account`, `/admin`, "Track Order") redirect to `/login` when signed out.

### Change the admin credentials (do this before going live)

Set env vars (locally in `.env.local`; on Vercel in Project → Settings → Environment Variables):

```
ADMIN_EMAIL=you@yourdomain.com
ADMIN_PASSWORD=your-strong-password
ADMIN_SECRET=any-long-random-string
```

`ADMIN_SECRET` signs the login cookie — changing it logs everyone out. See `.env.local.example`.

## Customer accounts & purchase history (needs Supabase)

Customer sign-up/sign-in and order history are powered by **Supabase Auth + a Postgres `orders` table**.
When a signed-in customer checks out, the order is saved and appears under **My Account → Purchase history**;
guests can still order over WhatsApp without an account. This activates as soon as the Supabase keys below are set.

## What the admin can do

- **Dashboard** — see product count, weight options, low-stock (≤5) and out-of-stock counts, and total inventory value.
- **Add product** — name, category, local/Hindi name, blurb, full description, key benefits, **multiple images (front pack / back pack / extra)**, **nutrition table (per 100g)**, **storage instructions**, badge (Bestseller/New/Limited), Featured (shows in the homepage best-sellers), Hidden, and any number of **weight → price → stock** rows.
- **Edit** any product.
- **Inline stock edit** — change the stock number on any weight right from the dashboard; it saves on blur.
- **Hide / show** a product from the storefront without deleting it.
- **Delete** a product.
- **Upload images** — or paste an image URL / an existing path like `/img/103.jpg`.

Every change is reflected on the live storefront immediately (the storefront pages are dynamically rendered).

## How storage works today

All product + inventory data flows through one module: `src/lib/inventory.ts`.

By default it uses a **JSON file store**:
- Source of truth on first run is `src/data/seed.json` (generated from your price list — 46 products).
- Edits are written to `data/inventory.json` (created automatically). This persists across restarts in local dev and on a normal Node server (`next start` / a VPS).

> **Important for Vercel:** Vercel's serverless filesystem is **read-only** (except a temp dir), so file-based edits do **not** persist between deploys or across serverless instances. For real, always-on, multi-device live inventory on Vercel, connect a database — see below. Everything else (the whole storefront, the design, the catalog) works on Vercel out of the box; only *admin write-persistence* needs the database.

## Going fully live: connect Supabase (recommended)

This gives you a hosted Postgres database + image storage + persistence that survives deploys.

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run:

```sql
create table products (
  id          text primary key,
  slug        text unique not null,
  name        text not null,
  category    text not null,
  blurb       text default '',
  hindi_name  text,
  description text,
  benefits    jsonb default '[]',
  variants    jsonb not null default '[]',   -- [{ "weight": "500g", "price": 675, "stock": 12 }]
  image       text,
  badge       text,
  featured    boolean default false,
  hidden      boolean default false,
  rating      numeric default 4.7,
  reviews     integer default 0,
  updated_at  timestamptz default now()
);
-- Create a public Storage bucket named "product-images" for uploads.
```

3. Add environment variables (Vercel → Settings → Environment Variables, and `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Seed the database with the current 46 products (a one-time script can push `src/data/seed.json` into the `products` table).

Because **every read and write already goes through `src/lib/inventory.ts`**, switching from the file store to a Supabase store is a single, contained change — the storefront, admin panel and cart don't change at all. Ping me with the keys and I'll wire the Supabase adapter + seed script.

## Offers / discounts

The scrolling offer bar and the automatic cart discounts are defined in code:
- Bar text: `src/components/layout/offer-marquee.tsx`
- Discount tiers (10% ≥ ₹999, 15% ≥ ₹2,499, 20% ≥ ₹4,999): `discountFor()` in `src/components/cart/cart-context.tsx`

## Checkout & auto stock depletion

The cart checks out via **WhatsApp** to the number in `src/lib/site.ts` (`SITE.phone`). There's no online payment gateway — orders are confirmed on WhatsApp. (We can add Razorpay/Stripe later if you want real online payments.)

When a customer places an order (cart checkout **or** the product-page "WhatsApp"/"Buy now" buttons), the ordered variants' **stock is automatically decremented** in inventory (`placeOrderAction` → `decrementStock`). Stock never goes below zero, and sold-out variants show an "Out of stock" state and can't be ordered.

## Product images (important)

The site ships with **relevance-matched stock photos** in `public/img/`. During this build I found and removed a watermarked "Unsplash+" image and corrected several mismatched shots (e.g. makhana was showing popcorn/salad). A few remain generic.

For a truly premium, on-brand look like the reference art, the best path is your **real product photography** (front & back of each pack). The admin **Add/Edit product → Images** panel lets you upload multiple images per product (front pack, back pack, extras) and pick which is the front — no code needed. Any product with no image shows a clean branded fallback tile instead of a wrong photo.

> Note on free stock: automated sources are constrained — Unsplash now requires an API key, and other free sources return watermarked non-commercial or off-topic images (unsafe for a commercial store). If you'd like, get a free Unsplash API key and I'll wire on-brand auto-imagery; otherwise upload your own shots via the admin.
