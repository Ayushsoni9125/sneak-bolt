import { z } from 'zod';

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
    .url('Image URL must be a valid URL')
    .min(1, 'Image URL is required'),
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
