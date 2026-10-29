'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/features/auth/actions';
import type { Order, OrderItem } from '@/types';

const ORDERS_COOKIE = 'sneaker_user_orders';

export async function createOrder(data: {
  items: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string;
    size: string;
    quantity: number;
  }>;
  total_amount: number;
  shipping_address?: {
    full_name?: string;
    city?: string;
    country?: string;
  };
}): Promise<{ success: boolean; order?: Order; error?: string }> {
  try {
    if (!data.items || data.items.length === 0) {
      return { success: false, error: 'Cannot create order with an empty bag.' };
    }

    const user = await getUser();
    const orderNumber = `SD-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const orderItems: OrderItem[] = data.items.map((item) => ({
      id: `item_${Math.random().toString(36).substring(2, 8)}`,
      product_id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
      image_url: item.image_url,
      size: item.size,
      quantity: item.quantity,
    }));

    const newOrder: Order = {
      id: orderId,
      order_number: orderNumber,
      user_id: user?.id,
      user_email: user?.email,
      items: orderItems,
      total_amount: data.total_amount,
      status: 'confirmed',
      shipping_address: data.shipping_address || {
        full_name: user?.user_metadata?.full_name || 'Collector',
        city: 'Mumbai',
        country: 'India',
      },
      created_at: new Date().toISOString(),
    };

    // 1. Attempt database persistence if table exists
    try {
      const supabase = await createClient();
      await supabase.from('orders').insert({
        id: newOrder.id,
        order_number: newOrder.order_number,
        user_id: newOrder.user_id,
        user_email: newOrder.user_email,
        items: newOrder.items,
        total_amount: newOrder.total_amount,
        status: newOrder.status,
        shipping_address: newOrder.shipping_address,
      });
    } catch {
      // Graceful fallback to cookie persistence
    }

    // 2. Persistent cookie storage (ensures orders persist even if DB migration is pending)
    const cookieStore = await cookies();
    const existingOrdersJson = cookieStore.get(ORDERS_COOKIE)?.value;
    let existingOrders: Order[] = [];
    if (existingOrdersJson) {
      try {
        existingOrders = JSON.parse(existingOrdersJson);
      } catch {
        existingOrders = [];
      }
    }

    const updatedOrders = [newOrder, ...existingOrders];
    cookieStore.set(ORDERS_COOKIE, JSON.stringify(updatedOrders), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    revalidatePath('/account');
    return { success: true, order: newOrder };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to place order';
    return { success: false, error: message };
  }
}

export async function getUserOrders(): Promise<Order[]> {
  const user = await getUser();
  const allOrdersMap = new Map<string, Order>();

  // 1. Read from cookie store
  try {
    const cookieStore = await cookies();
    const cookieData = cookieStore.get(ORDERS_COOKIE)?.value;
    if (cookieData) {
      const parsed: Order[] = JSON.parse(cookieData);
      parsed.forEach((ord) => {
        // If user is logged in, show their orders or session orders
        if (!user || !ord.user_email || ord.user_email === user.email) {
          allOrdersMap.set(ord.order_number, ord);
        }
      });
    }
  } catch {
    // ignore
  }

  // 2. Read from Supabase database if available
  if (user) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('orders')
        .select('*')
        .or(`user_id.eq.${user.id},user_email.eq.${user.email}`)
        .order('created_at', { ascending: false });

      if (data && Array.isArray(data)) {
        data.forEach((ord: Order) => {
          allOrdersMap.set(ord.order_number, ord);
        });
      }
    } catch {
      // ignore
    }
  }

  const result = Array.from(allOrdersMap.values());
  result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return result;
}
