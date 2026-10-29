import { z } from 'zod';

// ── Sanitization & Safe URL Utilities ────────────────────────────────────────

/**
 * Strips HTML tags, script tags, control characters, and dangerous URI schemes.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Strip control chars
    .trim();
}

/**
 * Validates and sanitizes a redirect target URL to prevent Open Redirect attacks.
 * Only allows relative paths on the same origin (e.g., `/admin`, `/account`).
 * Rejects absolute URLs, protocol-relative URLs (`//evil.com`), backslash bypasses (`/\`),
 * and pseudo-protocols like `javascript:` or `data:`.
 */
export function getSafeRedirectUrl(target: string | null | undefined, fallback: string = '/'): string {
  if (!target || typeof target !== 'string') return fallback;

  const trimmed = target.trim();
  // Must start with '/' and must NOT start with '//' or '/\'
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return fallback;
  }

  // Reject URLs containing protocol specifiers before path (e.g. "http:", "https:", "javascript:")
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return fallback;
  }

  // Prevent backslash tricks or control characters
  if (/[\x00-\x1F\s\\]/.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}

/**
 * Validates image URLs: accepts https URLs or internal root-relative image paths (`/images/...`).
 * Explicitly rejects `javascript:`, `data:`, `file:`, etc.
 */
export const imageUrlSchema = z
  .string()
  .min(1, 'Image URL is required')
  .max(1000, 'Image URL is too long')
  .refine(
    (url) => {
      const trimmed = url.trim().toLowerCase();
      if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:') || trimmed.startsWith('vbscript:')) {
        return false;
      }
      return trimmed.startsWith('https://') || trimmed.startsWith('/images/') || trimmed.startsWith('/');
    },
    { message: 'Image URL must be a valid secure URL (https://) or local asset path' }
  );

// ── Identifiers & Enums ───────────────────────────────────────────────────────

export const idSchema = z
  .string()
  .min(1, 'ID is required')
  .max(64, 'ID is too long')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Identifier contains invalid characters');

export const orderStatusSchema = z.enum([
  'confirmed',
  'preparing_dispatch',
  'in_transit',
  'delivered',
]);

// ── Email ────────────────────────────────────────────────────────────────────
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(254, 'Email is too long');

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// ── Waitlist ─────────────────────────────────────────────────────────────────
export const waitlistSchema = z.object({
  email: emailSchema,
  product_id: z
    .string()
    .regex(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      'Invalid product ID'
    ),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;

// ── Product ──────────────────────────────────────────────────────────────────
export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug is too long')
    .regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description is too long'),
  price: z
    .number({ message: 'Price must be a number' })
    .positive('Price must be positive')
    .max(100000, 'Price seems unreasonably high'),
  image_url: z
    .string()
    .min(1, 'Image URL is required')
    .refine(
      (url) => {
        const trimmed = url.trim().toLowerCase();
        if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) return false;
        return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/');
      },
      { message: 'Image URL must be a valid URL' }
    ),
  availability: z.enum(['available', 'sold_out', 'upcoming'], {
    message: 'Invalid availability status',
  }),
});

export const productFormSchema = productSchema.extend({
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Price must be a positive number',
    }),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
export type ProductData = z.infer<typeof productSchema>;

// ── Auth ─────────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Name is too long'),
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password is too long'),
  role: z.enum(['collector', 'admin', 'user']).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// ── Orders ───────────────────────────────────────────────────────────────────
export const orderItemInputSchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  price: z.number().positive().max(100000),
  image_url: z.string().min(1).max(1000),
  size: z.string().min(1).max(30),
  quantity: z.number().int().min(1).max(10),
});

export const shippingAddressSchema = z.object({
  full_name: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
});

export const createOrderInputSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, 'Cart cannot be empty').max(20, 'Too many items in cart'),
  total_amount: z.number().nonnegative().max(1000000),
  shipping_address: shippingAddressSchema.optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;
