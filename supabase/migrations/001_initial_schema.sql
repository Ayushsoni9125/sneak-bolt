-- ============================================================
-- Migration: 001_initial_schema
-- Creates profiles, products, and waitlist tables with RLS
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── Profiles ──────────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  role        text not null default 'user'
                check (role in ('user', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Automatically create a profile on signup (role always defaults to 'user')
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
    'user'   -- role is ALWAYS 'user' on signup regardless of any request data
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Products ──────────────────────────────────────────────────────────────────
create table if not exists public.products (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  slug         text not null unique,
  description  text not null,
  price        numeric(10,2) not null check (price > 0),
  image_url    text not null,
  availability text not null default 'upcoming'
                check (availability in ('available', 'sold_out', 'upcoming')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_availability_idx on public.products(availability);

-- ── Waitlist ──────────────────────────────────────────────────────────────────
-- Decision: ON DELETE CASCADE — when a product is deleted, its waitlist entries
-- are also deleted. This is appropriate because orphaned entries are meaningless.
create table if not exists public.waitlist (
  id               uuid primary key default uuid_generate_v4(),
  product_id       uuid not null references public.products(id) on delete cascade,
  email            text not null,
  normalized_email text not null,
  created_at       timestamptz not null default now(),
  constraint waitlist_product_email_unique unique (product_id, normalized_email)
);

create index if not exists waitlist_product_id_idx on public.waitlist(product_id);
create index if not exists waitlist_normalized_email_idx on public.waitlist(normalized_email);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles  enable row level security;
alter table public.products  enable row level security;
alter table public.waitlist  enable row level security;

-- ── Profiles RLS ─────────────────────────────────────────────────────────────

-- Users can read their own profile
create policy "users_read_own_profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (but NOT the role column)
create policy "users_update_own_profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Prevent users from changing their own role
    and role = (select role from public.profiles where id = auth.uid())
  );

-- Admins can read all profiles
create policy "admins_read_all_profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ── Products RLS ─────────────────────────────────────────────────────────────

-- Public read access to all products
create policy "public_read_products"
  on public.products for select
  using (true);

-- Only admins can insert products
create policy "admins_insert_products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can update products
create policy "admins_update_products"
  on public.products for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can delete products
create policy "admins_delete_products"
  on public.products for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- ── Waitlist RLS ──────────────────────────────────────────────────────────────

-- Anyone (including anon) can insert into the waitlist
-- The server action handles validation; anon key + RLS = safe
create policy "public_insert_waitlist"
  on public.waitlist for insert
  with check (true);

-- Only admins can read waitlist submissions
create policy "admins_read_waitlist"
  on public.waitlist for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can delete waitlist entries
create policy "admins_delete_waitlist"
  on public.waitlist for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
