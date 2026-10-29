# SneakerDrop — Premium Sneaker Discovery & E-Commerce Showcase

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sneak--bolt.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://sneak-bolt.vercel.app)

SneakerDrop is a modern, architectural e-commerce showcase for limited-edition sneaker releases. Built with Next.js 16 (App Router), Supabase (PostgreSQL, Auth, RLS), Tailwind CSS v4, and TypeScript.

---

## ⚡ Live Deployment & Evaluator Credentials

**Production URL**: [https://sneak-bolt.vercel.app](https://sneak-bolt.vercel.app)

When reviewing the live application or testing role-based access, use these pre-configured evaluator credentials directly or use the **1-click Auto-Fill buttons** on the [`/login`](https://sneak-bolt.vercel.app/login) page:

| Role | Email Address | Password | Permissions & Features |
| :--- | :--- | :--- | :--- |
| **Admin (Curator)** | `admin@sneakerdrop.internal` | `AdminPassword123!` | Full access to Admin Console ([`/admin`](https://sneak-bolt.vercel.app/admin)), Customer Orders ([`/admin/orders`](https://sneak-bolt.vercel.app/admin/orders)), Product Management ([`/admin/products`](https://sneak-bolt.vercel.app/admin/products)), Waitlist ([`/admin/waitlist`](https://sneak-bolt.vercel.app/admin/waitlist)) |
| **Collector (User)** | `collector@sneakerdrop.internal` | `CollectorPassword123!` | Full Storefront discovery, continuous luxury hero showcase, Add to Cart vs Proceed to Order, Shopping cart checkout, Acquisition Ledger & Order History ([`/account`](https://sneak-bolt.vercel.app/account)) |

---

## Features

### Dynamic Sneaker Catalogue
- **Availability States**: Live product status badges for `Available`, `Sold Out`, and `Upcoming`.
- **Editorial Design**: Luxury monochromatic aesthetic, responsive layouts, floating sneaker perspective animations.
- **Independent Purchase Actions**: 
  - **Add to Cart**: Adds items to cart without interrupting browsing.
  - **Proceed to Order**: 1-click buy action that immediately opens the Shopping Cart ready for checkout.
  - **In-Cart Checkout**: Dedicated `PROCEED TO CHECKOUT` flow with subtotal, taxes, and complimentary express dispatch.
- **Product Filtering**: Instant availability filter (`/sneakers?filter=available | sold_out | upcoming`).
- **Product Details**: Dedicated atelier pages (`/sneakers/[slug]`) with multi-angle galleries, size converter (US, EU, UK), and technical specs.

### Product-Specific Waitlist
- **Dynamic CTAs**: "Add to Cart" / "Proceed to Order" for in-stock drops vs "Join Waitlist" for sold-out and upcoming shoes.
- **RFC-compliant Validation**: Client and server-side validation with Zod.
- **Duplicate Prevention**: Composite unique constraint `(product_id, normalized_email)` at database level.
- **Product Existence Check**: Server-side verification before inserting waitlist entry.

### Role-Based Authentication & Authorization
- **Dual-Mode Auth**: Supabase Auth with `@supabase/ssr` cookies + signed HS256 JWT tokens with 7-day expiration.
- **Roles**: `collector` (user) and `admin`.
- **DB Security Trigger**: All new user registrations default strictly to `user` via PostgreSQL `handle_new_user()` trigger, preventing client-side elevation.
- **Dual-Layer Admin Guard**: 
  - Edge Proxy/Middleware check (`src/proxy.ts`) redirecting non-admins to `/unauthorized` or `/login`.
  - Server Layout & Server Action check in `src/app/admin/layout.tsx` and all admin mutations (`isAdmin()`).

### Protected Admin Dashboard
- **Overview Dashboard (`/admin`)**: Real-time DB counts for total products, inventory breakdown, and waitlist signups.
- **Customer Orders Management (`/admin/orders`)**: Real-time customer orders table with order status lifecycle updater.
- **Product Management (`/admin/products`)**: Table with thumbnail, price, quick availability toggle, edit, and delete.
- **Product Creation/Editing (`/admin/products/new`, `/admin/products/[id]/edit`)**: Reusable form with validation.
- **Waitlist Submissions (`/admin/waitlist`)**: Joined view showing submissions, timestamps, and product details.

---

## Security Hardening

- **Edge Proxy**: Path traversal defense, null-byte blocking, scanner protection (blocks `/.env`, `/.git`, etc. with 403), HTTP method filtering, and in-memory IP rate limiting.
- **Production Headers**: Strict Content-Security-Policy, HSTS, X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy, and COOP/CORP.
- **Financial Integrity**: Authoritative server-side price recalculation preventing client-side cart tampering.
- **Sanitization**: XSS sanitization (`sanitizeText`) and PostgREST query injection prevention.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4 + `@tailwindcss/postcss`
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security)
- **Validation**: Zod v4 & React Hook Form
- **Icons & Motion**: Lucide React & Motion
- **Testing**: Vitest & Testing Library with jsdom

---

## Database Architecture

### Migrations & Seed
Schema definitions are located in `supabase/migrations/`:
- `001_initial_schema.sql`: Profiles, products, waitlist, and orders tables with RLS and triggers.
- `supabase/seed.sql`: Initial seed products across available, sold out, and upcoming statuses.
- `supabase/COMPLETE_SETUP.sql`: Complete consolidated idempotent setup script.

### Table Schema Summary
- `public.profiles`: `id` (uuid, fk auth.users), `full_name`, `role` (`'user' | 'admin'`), timestamps.
- `public.products`: `id` (uuid), `name`, `slug` (unique), `description`, `price`, `image_url`, `availability` (`'available' | 'sold_out' | 'upcoming'`), timestamps.
- `public.orders`: `id`, `order_number`, `user_id`, `user_email`, `items`, `total_amount`, `status`, `shipping_address`, `created_at`.
- `public.waitlist`: `id` (uuid), `product_id` (fk products), `email`, `normalized_email`, `created_at`, unique on `(product_id, normalized_email)`.

---

## Getting Started

### 1. Environment Variables
Create a `.env.local` file with your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=your_jwt_secret_at_least_32_chars
AUTH_SECRET=your_auth_secret
ENCRYPTION_KEY=your_encryption_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
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
- **Unit & Integration Tests**: 32 automated tests passing via Vitest.
- **Linting**: 0 ESLint errors and warnings (`npm run lint`).
- **Build**: Turbopack production build verified (`npm run build`).
- **Deployment**: Live on Vercel at [https://sneak-bolt.vercel.app](https://sneak-bolt.vercel.app).
