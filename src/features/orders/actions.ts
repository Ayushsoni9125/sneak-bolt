'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { getUser, isAdmin } from '@/features/auth/actions';
import { addLocalOrder, getLocalOrders, updateLocalOrderStatus } from '@/lib/server-store';
import type { Order, OrderItem, OrderStatus } from '@/types';

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

    // 1. Save to server-side persistent store (accessible by admin across all sessions)
    addLocalOrder(newOrder);

    // 2. Attempt database persistence if table exists
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
      // Graceful fallback to server and cookie persistence
    }

    // 3. Persistent cookie storage for user's browser session
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
    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    return { success: true, order: newOrder };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to place order';
    return { success: false, error: message };
  }
}

export async function getUserOrders(): Promise<Order[]> {
  const user = await getUser();
  const allOrdersMap = new Map<string, Order>();

  // 1. Read from server-side store
  try {
    const localOrders = getLocalOrders();
    localOrders.forEach((ord) => {
      if (user && ord.user_email && ord.user_email === user.email) {
        allOrdersMap.set(ord.order_number, ord);
      }
    });
  } catch {
    // ignore
  }

  // 2. Read from cookie store
  try {
    const cookieStore = await cookies();
    const cookieData = cookieStore.get(ORDERS_COOKIE)?.value;
    if (cookieData) {
      const parsed: Order[] = JSON.parse(cookieData);
      parsed.forEach((ord) => {
        if (!user || !ord.user_email || ord.user_email === user.email) {
          allOrdersMap.set(ord.order_number, ord);
        }
      });
    }
  } catch {
    // ignore
  }

  // 3. Read from Supabase database if available
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

export async function getAdminOrders(): Promise<Order[]> {
  if (!(await isAdmin())) {
    return [];
  }

  const allOrdersMap = new Map<string, Order>();

  // 1. Get from server-side persistent store (all customer orders)
  try {
    const localOrders = getLocalOrders();
    localOrders.forEach((ord) => {
      allOrdersMap.set(ord.order_number, ord);
    });
  } catch {
    // ignore
  }

  // 2. Merge with Supabase database if available
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && Array.isArray(data)) {
      data.forEach((ord: Order) => {
        allOrdersMap.set(ord.order_number, ord);
      });
    }
  } catch {
    // ignore
  }

  // 3. Merge with current session cookie orders
  try {
    const cookieStore = await cookies();
    const cookieData = cookieStore.get(ORDERS_COOKIE)?.value;
    if (cookieData) {
      const parsed: Order[] = JSON.parse(cookieData);
      parsed.forEach((ord) => {
        if (!allOrdersMap.has(ord.order_number)) {
          allOrdersMap.set(ord.order_number, ord);
        }
      });
    }
  } catch {
    // ignore
  }

  const result = Array.from(allOrdersMap.values());
  result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return result;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  if (!(await isAdmin())) {
    return { success: false, error: 'Unauthorized. Admin access required.' };
  }

  // 1. Update in server store
  updateLocalOrderStatus(orderId, status);

  // 2. Update in Supabase database
  try {
    const supabase = await createClient();
    await supabase
      .from('orders')
      .update({ status })
      .or(`id.eq.${orderId},order_number.eq.${orderId}`);
  } catch {
    // ignore
  }

  // 3. Update in session cookie if order exists there
  try {
    const cookieStore = await cookies();
    const cookieData = cookieStore.get(ORDERS_COOKIE)?.value;
    if (cookieData) {
      const parsed: Order[] = JSON.parse(cookieData);
      const updated = parsed.map((ord) =>
        ord.id === orderId || ord.order_number === orderId ? { ...ord, status } : ord
      );
      cookieStore.set(ORDERS_COOKIE, JSON.stringify(updated), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  } catch {
    // ignore
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
  revalidatePath('/account');
  return { success: true };
}
