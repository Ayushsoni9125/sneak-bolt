# SneakerDrop — Premium Sneaker Discovery & E-Commerce Showcase

SneakerDrop is a modern, editorial e-commerce showcase for limited-edition sneaker releases. Built with Next.js 16 (App Router), Supabase (PostgreSQL, Auth, RLS), Tailwind CSS v4, and TypeScript.

---

## Features

### Dynamic Sneaker Catalogue
- **Availability States**: Live product status badges for `Available`, `Sold Out`, and `Upcoming`.
- **Editorial Design**: Dark mode aesthetic, typography, image zoom micro-animations, and responsive layouts.
- **Product Filtering**: Instant availability filter (`/sneakers?filter=available | sold_out | upcoming`).
- **Product Details**: Dedicated pages (`/sneakers/[slug]`) with image galleries, SKU metadata, and contextual CTAs.

### Product-Specific Waitlist
- **Dynamic CTAs**: "Add to Cart" for in-stock drops vs "Join Waitlist" for sold-out and upcoming shoes.
- **RFC-compliant Validation**: Client and server-side validation with Zod.
- **Duplicate Prevention**: Composite unique constraint `(product_id, normalized_email)` at database level.
- **Product Existence Check**: Server-side verification before inserting waitlist entry.

### Role-Based Authentication & Authorization
- **Supabase Auth**: Secure email/password authentication using `@supabase/ssr` cookies.
- **Roles**: `user` and `admin`.
- **DB Security Trigger**: All new user registrations default strictly to `user` via PostgreSQL `handle_new_user()` trigger, preventing client-side elevation.
- **Dual-Layer Admin Guard**: 
  - Edge Proxy/Middleware check (`src/proxy.ts`) redirecting non-admins to `/unauthorized` or `/login`.
  - Server Layout & Server Action check in `src/app/admin/layout.tsx` and all admin mutations (`isAdmin()`).

### Protected Admin Dashboard
- **Overview Dashboard (`/admin`)**: Real-time DB counts for total products, inventory breakdown, and waitlist signups.
- **Product Management (`/admin/products`)**: Table with thumbnail, price, quick availability toggle, edit, and delete.
- **Product Creation/Editing (`/admin/products/new`, `/admin/products/[id]/edit`)**: Reusable form with validation.
- **Waitlist Submissions (`/admin/waitlist`)**: Joined view showing submissions, timestamps, and product details.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + Vanilla CSS Design Tokens
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security)
- **Validation**: Zod v4 & React Hook Form
- **Icons & Motion**: Lucide React & Motion
- **Testing**: Vitest & Testing Library with jsdom

---

## Database Architecture

### Migrations & Seed
Schema definitions are located in `supabase/migrations/`:
- `001_initial_schema.sql`: Profiles, products, and waitlist tables with RLS and triggers.
- `supabase/seed.sql`: Initial seed products across available, sold out, and upcoming statuses.

### Table Schema Summary
- `public.profiles`: `id` (uuid, fk auth.users), `full_name`, `role` (`'user' | 'admin'`), timestamps.
- `public.products`: `id` (uuid), `name`, `slug` (unique), `description`, `price`, `image_url`, `availability` (`'available' | 'sold_out' | 'upcoming'`), timestamps.
- `public.waitlist`: `id` (uuid), `product_id` (fk products), `email`, `normalized_email`, `created_at`, unique on `(product_id, normalized_email)`.

---

## Getting Started

### 1. Environment Variables
Create a `.env.local` file with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Running Tests
```bash
npm test
```

### 5. Production Build
```bash
npm run build
```

---

## Quality Assurance & Verification
- **Unit & Integration Tests**: 26 automated tests passing via Vitest.
- **Linting**: 0 ESLint errors and warnings (`npm run lint`).
- **Build**: Turbopack production build verified (`npm run build`).
