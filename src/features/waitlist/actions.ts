'use server';

import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/features/auth/actions';
import { waitlistSchema, normalizeEmail } from '@/lib/validations';

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

  // Verify product exists
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, name')
    .eq('id', product_id)
    .single();

  if (productError || !product) {
    return { error: 'Product not found.' };
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
        error: `You're already on the waitlist for ${product.name}.`,
        alreadyRegistered: true,
      };
    }
    return { error: 'Failed to join waitlist. Please try again.' };
  }

  return { success: `You've been added to the waitlist for ${product.name}!` };
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
