'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/features/auth/actions';
import { productSchema, productFormSchema } from '@/lib/validations';
import { FALLBACK_PRODUCTS } from '@/data/seed-products';
import type { Product } from '@/types';

// ── Read ─────────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) return data;
  } catch {
    // fallback to seed catalog
  }
  return FALLBACK_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) return data;
  } catch {
    // fallback to seed catalog
  }
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) return data;
  } catch {
    // fallback to seed catalog
  }
  return FALLBACK_PRODUCTS.find((p) => p.id === id) ?? null;
}

// ── Admin mutations (server-verified authorization) ──────────────────────────

export async function createProduct(formData: FormData) {
  if (!(await isAdmin())) {
    return { error: 'Unauthorized: Admin access required.' };
  }

  const rawData = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    price: formData.get('price') as string,
    image_url: formData.get('image_url') as string,
    availability: formData.get('availability') as string,
  };

  const formResult = productFormSchema.safeParse(rawData);
  if (!formResult.success) {
    return { error: formResult.error.issues[0]?.message ?? 'Invalid product data.' };
  }

  const productData = {
    ...formResult.data,
    price: parseFloat(formResult.data.price),
  };

  const validResult = productSchema.safeParse(productData);
  if (!validResult.success) {
    return { error: validResult.error.issues[0]?.message ?? 'Invalid product data.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('products').insert(validResult.data);

  if (error) {
    if (error.code === '23505') {
      return { error: 'A product with this slug already exists.' };
    }
    return { error: 'Failed to create product. Please try again.' };
  }

  revalidatePath('/sneakers');
  revalidatePath('/admin/products');
  revalidatePath('/');
  return { success: 'Product created successfully.' };
}

export async function updateProduct(id: string, formData: FormData) {
  if (!(await isAdmin())) {
    return { error: 'Unauthorized: Admin access required.' };
  }

  const rawData = {
    name: formData.get('name') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    price: formData.get('price') as string,
    image_url: formData.get('image_url') as string,
    availability: formData.get('availability') as string,
  };

  const formResult = productFormSchema.safeParse(rawData);
  if (!formResult.success) {
    return { error: formResult.error.issues[0]?.message ?? 'Invalid product data.' };
  }

  const productData = {
    ...formResult.data,
    price: parseFloat(formResult.data.price),
  };

  const validResult = productSchema.safeParse(productData);
  if (!validResult.success) {
    return { error: validResult.error.issues[0]?.message ?? 'Invalid product data.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update({ ...validResult.data, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    if (error.code === '23505') {
      return { error: 'A product with this slug already exists.' };
    }
    return { error: 'Failed to update product. Please try again.' };
  }

  revalidatePath('/sneakers');
  revalidatePath(`/sneakers/${validResult.data.slug}`);
  revalidatePath('/admin/products');
  revalidatePath('/');
  return { success: 'Product updated successfully.' };
}

export async function deleteProduct(id: string) {
  if (!(await isAdmin())) {
    return { error: 'Unauthorized: Admin access required.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    if (error.code === '23503') {
      return {
        error:
          'Cannot delete: this product has waitlist entries. Remove waitlist entries first or check cascade policy.',
      };
    }
    return { error: 'Failed to delete product. Please try again.' };
  }

  revalidatePath('/sneakers');
  revalidatePath('/admin/products');
  revalidatePath('/');
  return { success: 'Product deleted successfully.' };
}

export async function updateAvailability(
  id: string,
  availability: 'available' | 'sold_out' | 'upcoming'
) {
  if (!(await isAdmin())) {
    return { error: 'Unauthorized: Admin access required.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update({ availability, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { error: 'Failed to update availability.' };

  revalidatePath('/sneakers');
  revalidatePath('/admin/products');
  revalidatePath('/');
  return { success: 'Availability updated.' };
}
