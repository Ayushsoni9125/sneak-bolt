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
  role        text not null default 'user' check (role in ('user', 'admin')),
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
    'user'
  )
  on conflict (id) do nothing;
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

-- 6. Seed all 12 Sneaker releases
insert into public.products (id, name, slug, description, price, image_url, availability)
values
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Court One Luxury',
    'court-one',
    'The Court One is where legacy begins. Crafted from premium full-grain Italian leather with a vulcanised rubber outsole, it carries decades of heritage into every step. Features tonal waxed cotton laces and an ultra-plush memory foam insole.',
    28999.00,
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1000&q=85',
    'available'
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Shadow High Archive',
    'shadow-high',
    'Born in the shadows, built for the spotlight. The Shadow High features an extended ankle collar, hand-stitched Japanese nubuck panels, and a carbon-fibre shank plate. Its muted monochrome palette makes it the most sought-after drop in our archive.',
    285.00,
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1000&q=85',
    'sold_out'
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Velocity Neo',
    'velocity',
    'Speed redefined. The Velocity Neo breaks the mould with an ultra-light aerodynamic knit chassis, asymmetric lock-down lacing, and dual-density supercritical foam. Drop incoming — join the waitlist to secure priority release access.',
    320.00,
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1000&q=85',
    'upcoming'
  ),
  (
    'a1b2c3d4-0004-0004-0004-000000000004',
    'Obsidian Low Prime',
    'obsidian-low',
    'Dark materials, razor-sharp execution. The Obsidian Low is precision-cut from oiled tumbled leather with reinforced topstitching and a gum rubber cupsole. Versatile, durable, and uncompromisingly understated.',
    215.00,
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1000&q=85',
    'available'
  ),
  (
    'a1b2c3d4-0005-0005-0005-000000000005',
    'Meridian Sculpt Runner',
    'meridian-runner',
    'Archival 90s running DNA fused with modern street architecture. An open-cell technical mesh upper over a sculpted architectural midsole creates all-day comfort. Dropping in limited quantities worldwide.',
    240.00,
    'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=1000&q=85',
    'upcoming'
  ),
  (
    'a1b2c3d4-0006-0006-0006-000000000006',
    'Element Zero Prototype',
    'element-zero',
    'A study in reduction. Stripped of all superfluous branding, the Element Zero pairs matte technical nylon with raw calfskin overlays on a modular split-sole platform. Strictly limited release — now entirely sold out.',
    360.00,
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=1000&q=85',
    'sold_out'
  ),
  (
    'a1b2c3d4-0007-0007-0007-000000000007',
    'Apex Trail 90',
    'apex-trail-90',
    'Gorpcore meets luxury. Engineered with waterproof Cordura mesh, quick-pull Kevlar speed lacing, and an aggressive Vibram Megagrip lugged outsole for seamless transitions between alpine trails and city streets.',
    275.00,
    'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=1000&q=85',
    'available'
  ),
  (
    'a1b2c3d4-0008-0008-0008-000000000008',
    'Ghost Knit Retro',
    'ghost-knit-retro',
    'Effortless lightweight lifestyle silhouette. Constructed with a seamless mono-weave jacquard knit upper that hugs your foot like a second skin, anchored by responsive air-infused cushioning.',
    185.00,
    'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=1000&q=85',
    'available'
  ),
  (
    'a1b2c3d4-0009-0009-0009-000000000009',
    'Komorebi Luxe Edition',
    'komorebi-luxe',
    'An artisan collaboration combining Okayama selvedge denim, vegetable-tanned Vachetta leather, and hand-burnished brass hardware. Aged to perfection as you wear it. Limited to 300 numbered pairs.',
    345.00,
    'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=1000&q=85',
    'upcoming'
  ),
  (
    'a1b2c3d4-0010-0010-0010-000000000010',
    'Stratum Low Deconstruct',
    'stratum-low',
    'Inside-out construction. Exposed foam tongues, inverted seams, and hand-distressed detailing make the Stratum Low a raw, sculptural masterwork. Sold out worldwide within minutes of its original drop.',
    230.00,
    'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=1000&q=85',
    'sold_out'
  ),
  (
    'a1b2c3d4-0011-0011-0011-000000000011',
    'Vortex Prime Sprint',
    'vortex-prime',
    'High-performance energy return wrapped in runway aesthetics. Features nitrogen-infused foam propulsion rods, breathable TPU film reinforcements, and a reflective 3M heel counter.',
    295.00,
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1000&q=85',
    'available'
  ),
  (
    'a1b2c3d4-0012-0012-0012-000000000012',
    'Hyperion High 88',
    'hyperion-high-88',
    'Golden era hardwood prestige. Re-engineered to 1988 factory specifications with heavy-gauge top-grain leather, padded ankle collars, and an authentic pre-aged tea-stained midsole. Releasing next month.',
    410.00,
    'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=1000&q=85',
    'upcoming'
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  availability = excluded.availability;
