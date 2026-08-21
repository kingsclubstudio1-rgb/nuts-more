-- Nuts & More — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query → paste → Run).

-- ------------------------------------------------------------------
-- Customer profiles (1:1 with auth.users)
-- ------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users on delete cascade,
  name        text,
  phone       text,
  created_at  timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: self" on public.profiles;
create policy "profiles: self" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- auto-create a profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, phone)
  values (new.id, new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------
-- Orders (customer purchase history)
-- ------------------------------------------------------------------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  items            jsonb not null,           -- [{ id, name, weight, qty, price }]
  subtotal         integer not null,
  discount         integer not null default 0,
  shipping         integer not null default 0,
  total            integer not null,
  address          jsonb,                    -- { name, phone, line1, city, pincode, state }
  payment_id       text,
  status           text not null default 'placed',  -- placed|paid|confirmed|packed|shipped|delivered|cancelled
  channel          text default 'razorpay',
  -- Invoicing (GST tax invoice)
  invoice_number   text unique,              -- e.g. "NM/2526/0001", assigned once via next_invoice_seq()
  payment_method   text,                     -- card|upi|netbanking|wallet|emi (from Razorpay payment lookup)
  discount_label   text,                     -- e.g. "15% off (orders above ₹2,499)" — matches the offer marquee tier
  taxable_amount   integer not null default 0,
  cgst             integer not null default 0,
  sgst             integer not null default 0,
  igst             integer not null default 0,
  gst_rate         numeric not null default 0,
  created_at       timestamptz default now()
);

create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

alter table public.orders enable row level security;

drop policy if exists "orders: own read" on public.orders;
create policy "orders: own read" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "orders: own insert" on public.orders;
create policy "orders: own insert" on public.orders
  for insert with check (auth.uid() = user_id);

-- ------------------------------------------------------------------
-- Products (optional: move the catalog to the DB for multi-instance
-- live inventory on Vercel). The app works without this using the
-- bundled seed; wire src/lib/inventory.ts to this table when ready.
-- ------------------------------------------------------------------
create table if not exists public.products (
  id          text primary key,
  slug        text unique not null,
  name        text not null,
  category    text not null,
  blurb       text default '',
  hindi_name  text,
  description text,
  benefits    jsonb default '[]',
  nutrition   jsonb default '[]',
  storage     text,
  variants    jsonb not null default '[]',   -- [{ weight, price, stock }]
  image       text,
  images      jsonb default '[]',
  badge       text,
  featured    boolean default false,
  hidden      boolean default false,
  rating      numeric default 4.7,
  reviews     integer default 0,
  hsn         text,                          -- HSN code for GST invoices (verify with your accountant)
  gst_rate    numeric,                       -- GST % for this product; null uses the store-wide rate
  updated_at  timestamptz default now()
);

alter table public.products enable row level security;
-- public can read visible products; writes happen via the service-role key (admin)
drop policy if exists "products: public read" on public.products;
create policy "products: public read" on public.products
  for select using (hidden = false);

-- ------------------------------------------------------------------
-- Categories (admin can add / edit / remove)
-- ------------------------------------------------------------------
create table if not exists public.categories (
  slug        text primary key,
  name        text not null,
  tagline     text default '',
  description text default '',
  image       text,
  sort        integer default 99
);
alter table public.categories enable row level security;
drop policy if exists "categories: public read" on public.categories;
create policy "categories: public read" on public.categories for select using (true);

-- ------------------------------------------------------------------
-- Editable site content (hero slides, landing images, etc.)  key -> json
-- ------------------------------------------------------------------
create table if not exists public.site_settings (
  key         text primary key,
  value       jsonb,
  updated_at  timestamptz default now()
);
alter table public.site_settings enable row level security;
drop policy if exists "settings: public read" on public.site_settings;
create policy "settings: public read" on public.site_settings for select using (true);
-- Holds e.g. key="invoice_config" -> { gstin, gstRate, invoicePrefix } (admin-editable, no public write policy)

-- ------------------------------------------------------------------
-- Sequential, atomic invoice numbering per financial year (Apr-Mar)
-- ------------------------------------------------------------------
create table if not exists public.invoice_counters (
  fy   text primary key,   -- e.g. "2526" for FY 2025-26
  seq  integer not null default 0
);
alter table public.invoice_counters enable row level security;

create or replace function public.next_invoice_seq(p_fy text)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  next_val integer;
begin
  insert into public.invoice_counters (fy, seq) values (p_fy, 1)
  on conflict (fy) do update set seq = invoice_counters.seq + 1
  returning seq into next_val;
  return next_val;
end;
$$;

-- GST requires a gap-free invoice series, so only the server may draw a number.
-- Without this, the default PUBLIC grant exposes it at /rest/v1/rpc/next_invoice_seq
-- where anyone could burn numbers and punch holes in the sequence.
revoke execute on function public.next_invoice_seq(text) from public;
revoke execute on function public.next_invoice_seq(text) from anon;
revoke execute on function public.next_invoice_seq(text) from authenticated;
grant  execute on function public.next_invoice_seq(text) to service_role;

-- ------------------------------------------------------------------
-- Order idempotency: one captured payment must never book two orders.
-- Without this, a retried or replayed checkout/verify call takes stock
-- twice and sends a second set of invoice emails for a single payment.
-- ------------------------------------------------------------------
create unique index if not exists orders_payment_id_key
  on public.orders (payment_id)
  where payment_id is not null;

-- ------------------------------------------------------------------
-- Atomic stock decrement.
-- A read-modify-write in application code oversold the last unit: two
-- concurrent checkouts both read stock=1, both wrote 0, and both orders
-- shipped. This locks the rows, verifies every requested quantity is
-- available, and only then applies the decrement -- all in one
-- transaction -- returning which lines were short if any.
-- ------------------------------------------------------------------
create or replace function public.decrement_stock(p_items jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  it           jsonb;
  cur          int;
  insufficient jsonb := '[]'::jsonb;
begin
  -- Consistent lock order avoids deadlocks between concurrent checkouts.
  perform 1 from public.products
   where id in (select value->>'id' from jsonb_array_elements(p_items))
   order by id
     for update;

  for it in select value from jsonb_array_elements(p_items) loop
    select (v->>'stock')::int into cur
      from public.products p, jsonb_array_elements(p.variants) v
     where p.id = it->>'id' and v->>'weight' = it->>'weight';

    if cur is null or cur < (it->>'qty')::int then
      insufficient := insufficient || jsonb_build_object(
        'id',        it->>'id',
        'weight',    it->>'weight',
        'requested', (it->>'qty')::int,
        'available', coalesce(cur, 0));
    end if;
  end loop;

  if jsonb_array_length(insufficient) > 0 then
    return jsonb_build_object('ok', false, 'insufficient', insufficient);
  end if;

  for it in select value from jsonb_array_elements(p_items) loop
    update public.products p
       set variants = (
             select jsonb_agg(
                      case when v->>'weight' = it->>'weight'
                           then jsonb_set(v, '{stock}',
                                  to_jsonb(((v->>'stock')::int) - (it->>'qty')::int))
                           else v end)
               from jsonb_array_elements(p.variants) v)
     where p.id = it->>'id';
  end loop;

  return jsonb_build_object('ok', true);
end;
$$;

revoke execute on function public.decrement_stock(jsonb) from public;
revoke execute on function public.decrement_stock(jsonb) from anon;
revoke execute on function public.decrement_stock(jsonb) from authenticated;
grant  execute on function public.decrement_stock(jsonb) to service_role;

-- ------------------------------------------------------------------
-- Enquiries (contact form, bulk orders, corporate gifting, returns)
--
-- Live in production but previously missing from this file: rebuilding
-- from schema.sql would have dropped every contact, bulk, gifting and
-- return submission on the floor. saveEnquiry swallows the insert error
-- and the API still answers ok when the notification email sends, so the
-- failure would have been invisible.
-- ------------------------------------------------------------------
create table if not exists public.enquiries (
  id                 uuid primary key default gen_random_uuid(),
  type               text not null default 'contact',  -- contact|bulk|gifting|return
  name               text,
  email              text,
  phone              text,
  company            text,
  city               text,
  subject            text,
  business_type      text,
  products           text,
  quantity           text,
  packaging          text,
  delivery_location  text,
  expected_date      text,
  message            text,
  status             text not null default 'new',      -- new|handled
  created_at         timestamptz default now()
);

create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

-- Written and read only through the service-role key (public API route +
-- admin panel), so RLS stays on with no policy: nothing reaches it directly.
alter table public.enquiries enable row level security;
