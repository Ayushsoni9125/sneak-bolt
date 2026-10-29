-- ============================================================
-- SNEAKERDROP — COMPLETE DATABASE SETUP (SCHEMA + SEED)
-- Run this in your Supabase SQL Editor (the >_ icon on the left)
-- ============================================================

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- 2. Profiles table & trigger
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  role        text not null default 'collector' check (role in ('collector', 'user', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'collector')
  )
  on conflict (id) do update set
    full_name = coalesce(new.raw_user_meta_data->>'full_name', public.profiles.full_name),
    role = coalesce(new.raw_user_meta_data->>'role', public.profiles.role);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Products table
create table if not exists public.products (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  slug         text not null unique,
  description  text not null,
  price        numeric(10,2) not null check (price > 0),
  image_url    text not null,
  availability text not null default 'upcoming' check (availability in ('available', 'sold_out', 'upcoming')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_availability_idx on public.products(availability);

-- 4. Waitlist table
create table if not exists public.waitlist (
  id                uuid primary key default uuid_generate_v4(),
  product_id        uuid not null references public.products(id) on delete cascade,
  email             text not null,
  normalized_email  text not null,
  created_at        timestamptz not null default now(),
  constraint waitlist_unique_product_email unique (product_id, normalized_email)
);

create index if not exists waitlist_product_id_idx on public.waitlist(product_id);
create index if not exists waitlist_normalized_email_idx on public.waitlist(normalized_email);

-- 5. Orders table (Acquisition Ledger)
create table if not exists public.orders (
  id               text primary key,
  order_number     text not null unique,
  user_id          uuid references auth.users(id) on delete set null,
  user_email       text,
  items            jsonb not null default '[]'::jsonb,
  total_amount     numeric(10,2) not null check (total_amount >= 0),
  status           text not null default 'confirmed' check (status in ('confirmed', 'preparing_dispatch', 'in_transit', 'delivered')),
  shipping_address jsonb,
  created_at       timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_order_number_idx on public.orders(order_number);

-- 6. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.waitlist enable row level security;
alter table public.orders   enable row level security;

-- Orders policies
drop policy if exists "Users can view their own orders" on public.orders;
create policy "Users can view their own orders" on public.orders for select using (
  auth.uid() = user_id or auth.uid() is null
);

drop policy if exists "Users can create orders" on public.orders;
create policy "Users can create orders" on public.orders for insert with check (true);

-- Profiles policies
drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone" on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Products policies
drop policy if exists "Products are viewable by everyone" on public.products;
create policy "Products are viewable by everyone" on public.products for select using (true);

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products" on public.products for insert with check (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products" on public.products for update using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products" on public.products for delete using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- Waitlist policies
drop policy if exists "Anyone can join waitlist" on public.waitlist;
create policy "Anyone can join waitlist" on public.waitlist for insert with check (true);

drop policy if exists "Admins can view waitlist" on public.waitlist;
create policy "Admins can view waitlist" on public.waitlist for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- 7. Seed all 12 Sneaker releases
insert into public.products (id, name, slug, description, price, image_url, availability)
values
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Court One Luxury',
    'court-one',
    'Engineered in Civitanova Marche, Italy. The Court One combines full-grain Tuscan calfskin with an Italian Margom vulcanised rubber cupsole. Hand-buffed tonal waxed cotton laces and an anatomic calf-lined footbed provide peerless comfort.',
    28999.00,
    '/images/court-one-hero.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Shadow High Archive',
    'shadow-high',
    'Archival high-collar court silhouette handcrafted from oiled Japanese nubuck with carbon-fibre midfoot torsion shanks. Features custom matte-black metal eyelets and a serialized NFC verification tag embedded in the tongue.',
    34999.00,
    '/images/shadow-high.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Velocity Neo',
    'velocity',
    'Kinetic propulsion racer. Constructed with an ultra-light aerodynamic mono-weave knit upper, asymmetric lock-down cabling, and dual-density supercritical foam dampening. Releasing in strict batch runs.',
    24500.00,
    '/images/velocity.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0004-0004-0004-000000000004',
    'Obsidian Low Prime',
    'obsidian-low',
    'Minimalist luxury perfected. Precision-cut from tumbled French calfskin with reinforced double-stitch paneling, raw suede lining, and a bespoke natural gum cupsole. Subtle debossed serial numbering on lateral heel.',
    26000.00,
    '/images/obsidian-low.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0005-0005-0005-000000000005',
    'Meridian Sculpt Runner',
    'meridian-runner',
    'Architectural sculpted geometry. Designed with an open-cell technical spacer mesh core layered over an exaggerated dual-density chassis. Delivers sculptural presence without compromising lightweight comfort.',
    32000.00,
    '/images/meridian-runner.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0006-0006-0006-000000000006',
    'Element Zero Prototype',
    'element-zero',
    'Deconstructivist luxury footwear. Stripped of all superfluous ornament, the Element Zero pairs matte technical ballistic nylon with raw vegetable-tanned overlays on a decoupled split-sole platform. Strictly numbered edition of 250 pairs.',
    38500.00,
    '/images/element-zero.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0007-0007-0007-000000000007',
    'Apex Trail 90',
    'apex-trail-90',
    'Gorpcore redefined through luxury design techniques. Waterproof Cordura 500D chassis with bonded TPU mudguards, Kevlar speed lacing, and an aggressive Vibram Megagrip lugged outsole.',
    27500.00,
    '/images/apex-trail.jpg',
    'upcoming'
  ),
  (
    'a1b2c3d4-0008-0008-0008-000000000008',
    'Ghost Knit Retro',
    'ghost-knit-retro',
    'Seamless mono-weave jacquard knit upper hugs the contours of the foot like a bespoke second skin. Features an unlined tongue, French terry collar, and an energy-rebounding nitrogen-infused capsule bed.',
    23500.00,
    '/images/ghost-knit.jpg',
    'upcoming'
  ),
  (
    'a1b2c3d4-0009-0009-0009-000000000009',
    'Komorebi Luxe Edition',
    'komorebi-luxe',
    'Inspired by sunlight filtering through natural canopies. Crafted from artisanal 14oz Okayama selvedge denim, natural sashiko hand-stitching, and an indigo-dipped vegetable tanned heel tab.',
    33000.00,
    '/images/komorebi-luxe.jpg',
    'upcoming'
  ),
  (
    'a1b2c3d4-0010-0010-0010-000000000010',
    'Stratum Low Deconstruct',
    'stratum-low',
    'Raw-edge layered English suede with exposed foam borders and asymmetric perforations across the medial quarter. Finished with a semi-translucent smoke crystal cupsole and waxed linen laces.',
    29500.00,
    '/images/stratum-low.jpg',
    'upcoming'
  ),
  (
    'a1b2c3d4-0011-0011-0011-000000000011',
    'Vortex Prime Sprint',
    'vortex-prime',
    'Engineered for track and pavement speed trials. Features a featherlight mono-filament composite shell with metallic graphite finish and an energy-returning carbon fiber sprint plate.',
    26500.00,
    '/images/vortex-prime.jpg',
    'sold_out'
  ),
  (
    'a1b2c3d4-0012-0012-0012-000000000012',
    'Chalk Court 88 Studio',
    'hyperion-high-88',
    'Archival 1988 pro court championship silhouette reissued with modern internal ergonomics. Heavyweight 2.2mm full-grain leather, padded collar, and vintage off-white aged cupsole finish. Limited collector edition.',
    36999.00,
    '/images/court-one-profile.jpg',
    'sold_out'
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  availability = excluded.availability;
