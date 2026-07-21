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
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users on delete cascade,
  items       jsonb not null,           -- [{ id, name, weight, qty, price }]
  subtotal    integer not null,
  discount    integer not null default 0,
  shipping    integer not null default 0,
  total       integer not null,
  address     jsonb,                    -- { name, phone, line1, city, pincode, state }
  payment_id  text,
  status      text not null default 'placed',  -- placed|paid|confirmed|packed|shipped|delivered|cancelled
  channel     text default 'razorpay',
  created_at  timestamptz default now()
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
