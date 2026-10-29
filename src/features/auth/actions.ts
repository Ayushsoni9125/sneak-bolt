'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loginSchema, signupSchema, normalizeEmail } from '@/lib/validations';

export async function login(formData: FormData) {
  const rawData = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const result = loginSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: normalizeEmail(result.data.email),
    password: result.data.password,
  });

  if (error) {
    if (error.message?.toLowerCase().includes('email not confirmed')) {
      return { error: 'Please check your email and click the confirmation link before signing in.' };
    }
    return { error: 'Invalid email or password.' };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  const rawData = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const result = signupSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? 'Invalid input.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: normalizeEmail(result.data.email),
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.full_name,
        // role is intentionally NOT set here — it is assigned by a DB trigger
      },
    },
  });

  if (error) {
    if (error.message?.includes('already registered')) {
      return { error: 'An account with this email already exists.' };
    }
    if (error.message?.toLowerCase().includes('rate limit')) {
      return {
        error: 'Email rate limit reached (Supabase limits free projects to ~3 verification emails/hour). Turn off "Confirm email" in your Supabase Auth dashboard to test signups without limits.',
      };
    }
    return { error: error.message || 'Failed to create account. Please try again.' };
  }

  return { success: 'Account created! Please check your email to confirm.' };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getUserProfile();
  return profile?.role === 'admin';
}
