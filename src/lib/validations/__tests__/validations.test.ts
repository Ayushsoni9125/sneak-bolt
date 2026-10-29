import { describe, it, expect } from 'vitest';
import {
  emailSchema,
  normalizeEmail,
  waitlistSchema,
  productSchema,
  productFormSchema,
  loginSchema,
  signupSchema,
} from '../index';

describe('normalizeEmail', () => {
  it('trims leading and trailing whitespace', () => {
    expect(normalizeEmail('  user@example.com  ')).toBe('user@example.com');
  });

  it('converts to lowercase', () => {
    expect(normalizeEmail('User.NAME@Example.COM')).toBe('user.name@example.com');
  });

  it('handles already trimmed and lowercase emails', () => {
    expect(normalizeEmail('clean@domain.co')).toBe('clean@domain.co');
  });
});

describe('emailSchema', () => {
  it('accepts valid RFC emails', () => {
    expect(emailSchema.safeParse('collector@sneakerdrop.com').success).toBe(true);
    expect(emailSchema.safeParse('first.last+tag@sub.domain.org').success).toBe(true);
  });

  it('rejects empty email', () => {
    const res = emailSchema.safeParse('');
    expect(res.success).toBe(false);
  });

  it('rejects invalid email formats', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false);
    expect(emailSchema.safeParse('@missing-user.com').success).toBe(false);
    expect(emailSchema.safeParse('missing-domain@').success).toBe(false);
    expect(emailSchema.safeParse('spaces in@email.com').success).toBe(false);
  });
});

describe('waitlistSchema', () => {
  const validUUID = 'a1b2c3d4-0001-0001-0001-000000000001';

  it('accepts valid email and product UUID', () => {
    const res = waitlistSchema.safeParse({
      email: 'hype@sneakerdrop.com',
      product_id: validUUID,
    });
    expect(res.success).toBe(true);
  });

  it('rejects invalid UUID for product_id', () => {
    const res = waitlistSchema.safeParse({
      email: 'hype@sneakerdrop.com',
      product_id: 'not-a-uuid',
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0]?.message).toMatch(/Invalid product ID/i);
    }
  });

  it('rejects invalid email in waitlist', () => {
    const res = waitlistSchema.safeParse({
      email: 'bad-email',
      product_id: validUUID,
    });
    expect(res.success).toBe(false);
  });
});

describe('productSchema', () => {
  const validProduct = {
    name: 'Velocity Runner',
    slug: 'velocity-runner',
    description: 'High-tech performance silhouette crafted for maximum speed and comfort.',
    price: 240.0,
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    availability: 'available' as const,
  };

  it('accepts a valid product', () => {
    expect(productSchema.safeParse(validProduct).success).toBe(true);
  });

  it('accepts all three availability states', () => {
    for (const status of ['available', 'sold_out', 'upcoming'] as const) {
      expect(productSchema.safeParse({ ...validProduct, availability: status }).success).toBe(true);
    }
  });

  it('rejects invalid availability state', () => {
    const res = productSchema.safeParse({
      ...validProduct,
      availability: 'discontinued',
    });
    expect(res.success).toBe(false);
  });

  it('rejects slug with capital letters or invalid characters', () => {
    expect(productSchema.safeParse({ ...validProduct, slug: 'Velocity-Runner' }).success).toBe(false);
    expect(productSchema.safeParse({ ...validProduct, slug: 'velocity_runner' }).success).toBe(false);
    expect(productSchema.safeParse({ ...validProduct, slug: 'velocity runner' }).success).toBe(false);
  });

  it('rejects negative or zero price', () => {
    expect(productSchema.safeParse({ ...validProduct, price: -10 }).success).toBe(false);
    expect(productSchema.safeParse({ ...validProduct, price: 0 }).success).toBe(false);
  });

  it('rejects invalid image URL', () => {
    expect(productSchema.safeParse({ ...validProduct, image_url: 'not-a-url' }).success).toBe(false);
  });
});

describe('productFormSchema', () => {
  it('validates string price input in forms', () => {
    const formProduct = {
      name: 'Court One',
      slug: 'court-one',
      description: 'Classic heritage court sneaker made with premium full-grain leather.',
      price: '195.50',
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      availability: 'available' as const,
    };
    expect(productFormSchema.safeParse(formProduct).success).toBe(true);
  });

  it('rejects non-numeric string price in forms', () => {
    const formProduct = {
      name: 'Court One',
      slug: 'court-one',
      description: 'Classic heritage court sneaker made with premium full-grain leather.',
      price: 'abc',
      image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      availability: 'available' as const,
    };
    expect(productFormSchema.safeParse(formProduct).success).toBe(false);
  });
});

describe('loginSchema and signupSchema', () => {
  it('validates login credentials', () => {
    expect(loginSchema.safeParse({ email: 'admin@sneakerdrop.com', password: 'password123' }).success).toBe(true);
    expect(loginSchema.safeParse({ email: 'admin@sneakerdrop.com', password: '' }).success).toBe(false);
  });

  it('validates signup credentials with password length constraint (min 8 chars)', () => {
    const valid = {
      full_name: 'Ayush Soni',
      email: 'ayush@example.com',
      password: 'strongpassword123',
    };
    expect(signupSchema.safeParse(valid).success).toBe(true);

    const shortPassword = { ...valid, password: 'short' };
    expect(signupSchema.safeParse(shortPassword).success).toBe(false);

    const shortName = { ...valid, full_name: 'A' };
    expect(signupSchema.safeParse(shortName).success).toBe(false);
  });
});
