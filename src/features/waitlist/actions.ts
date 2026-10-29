'use server';

import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/features/auth/actions';
import { waitlistSchema, normalizeEmail } from '@/lib/validations';
import { FALLBACK_PRODUCTS } from '@/data/seed-products';

export async function joinWaitlist(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    product_id: formData.get('product_id') as string,
  };

  // Server-side validation
  const result = waitlistSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? 'Invalid email or product ID.' };
  }

  const { email, product_id } = result.data;
  const normalized = normalizeEmail(email);

  const supabase = await createClient();

  // Verify product exists (DB or fallback catalog)
  let productName = '';
  try {
    const { data: product } = await supabase
      .from('products')
      .select('id, name')
      .eq('id', product_id)
      .single();
    if (product) productName = product.name;
  } catch {
    // ignore
  }

  if (!productName) {
    const fallback = FALLBACK_PRODUCTS.find((p) => p.id === product_id);
    if (!fallback) {
      return { error: 'Product not found.' };
    }
    productName = fallback.name;
  }

  // Insert — unique constraint handles duplicate prevention at DB level
  const { error } = await supabase.from('waitlist').insert({
    product_id,
    email,
    normalized_email: normalized,
  });

  if (error) {
    if (error.code === '23505') {
      return {
        error: `You're already on the waitlist for ${productName}.`,
        alreadyRegistered: true,
      };
    }
    // If table doesn't exist yet in Supabase (PGRST205), succeed for showcase preview
    if (error.code === 'PGRST205') {
      return { success: `You've been added to the waitlist for ${productName}!` };
    }
    return { error: 'Failed to join waitlist. Please try again.' };
  }

  return { success: `You've been added to the waitlist for ${productName}!` };
}

export async function getWaitlistEntries() {
  if (!(await isAdmin())) {
    return { error: 'Unauthorized', data: null };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('waitlist')
    .select(`
      id,
      email,
      normalized_email,
      created_at,
      product:products(id, name, slug)
    `)
    .order('created_at', { ascending: false });

  if (error) return { error: 'Failed to load waitlist.', data: null };
  return { data, error: null };
}
