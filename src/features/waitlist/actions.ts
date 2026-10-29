'use server';

import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/features/auth/actions';
import { waitlistSchema, normalizeEmail } from '@/lib/validations';
import { FALLBACK_PRODUCTS } from '@/data/seed-products';
import { addLocalWaitlistEntry, getLocalWaitlistEntries } from '@/lib/server-store';

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

  // Verify product exists (DB or fallback catalog)
  let productName = '';
  try {
    const supabase = await createClient();
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

  // Save to persistent server store
  const localResult = addLocalWaitlistEntry({
    product_id,
    email,
    normalized_email: normalized,
  });

  if (localResult.alreadyRegistered) {
    return {
      error: `You're already on the waitlist for ${productName}.`,
      alreadyRegistered: true,
    };
  }

  // Attempt DB insert in background
  try {
    const supabase = await createClient();
    await supabase.from('waitlist').insert({
      product_id,
      email,
      normalized_email: normalized,
    });
  } catch {
    // Local store already succeeded
  }

  return { success: `You've been added to the waitlist for ${productName}!` };
}

export async function getWaitlistEntries() {
  if (!(await isAdmin())) {
    return { error: 'Unauthorized', data: null };
  }

  try {
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

    if (!error && data && data.length > 0) {
      return { data, error: null };
    }
  } catch {
    // fallback to resilient local store
  }

  const localEntries = getLocalWaitlistEntries();
  return { data: localEntries, error: null };
}
