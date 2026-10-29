import fs from 'fs';
import path from 'path';
import type { Order, WaitlistEntry, OrderStatus } from '@/types';
import { FALLBACK_PRODUCTS } from '@/data/seed-products';

// File path for persistent local state (survives dev server restarts)
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

interface LocalStoreData {
  waitlist: WaitlistEntry[];
  orders: Order[];
}

// Initial seed waitlist submissions
const INITIAL_WAITLIST: WaitlistEntry[] = [
  {
    id: 'wl_seed_001',
    product_id: 'a1b2c3d4-0007-0007-0007-000000000007',
    email: 'karan.sharma92@gmail.com',
    normalized_email: 'karan.sharma92@gmail.com',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    product: {
      id: 'a1b2c3d4-0007-0007-0007-000000000007',
      name: 'Apex Trail 90',
      slug: 'apex-trail-90',
    },
  },
  {
    id: 'wl_seed_002',
    product_id: 'a1b2c3d4-0008-0008-0008-000000000008',
    email: 'riya.kapoor@collector.co',
    normalized_email: 'riya.kapoor@collector.co',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    product: {
      id: 'a1b2c3d4-0008-0008-0008-000000000008',
      name: 'Ghost Knit Retro',
      slug: 'ghost-knit-retro',
    },
  },
  {
    id: 'wl_seed_003',
    product_id: 'a1b2c3d4-0009-0009-0009-000000000009',
    email: 'arjun.verma@techstudio.in',
    normalized_email: 'arjun.verma@techstudio.in',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
    product: {
      id: 'a1b2c3d4-0009-0009-0009-000000000009',
      name: 'Komorebi Luxe Edition',
      slug: 'komorebi-luxe',
    },
  },
  {
    id: 'wl_seed_004',
    product_id: 'a1b2c3d4-0010-0010-0010-000000000010',
    email: 'ananya.iyer@vaultarchive.com',
    normalized_email: 'ananya.iyer@vaultarchive.com',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
    product: {
      id: 'a1b2c3d4-0010-0010-0010-000000000010',
      name: 'Cyber Dune High',
      slug: 'cyber-dune',
    },
  },
];

// Initial seed orders placed by users
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_seed_101',
    order_number: 'SD-ORD-849201',
    user_id: 'usr_aditya_01',
    user_email: 'aditya.deshmukh@gmail.com',
    items: [
      {
        id: 'item_101_1',
        product_id: 'a1b2c3d4-0001-0001-0001-000000000001',
        name: 'Court One Luxury',
        slug: 'court-one',
        price: 28999.0,
        image_url: '/images/court-one-hero.jpg',
        size: 'UK 9 / US 10',
        quantity: 1,
      },
    ],
    total_amount: 28999.0,
    status: 'in_transit',
    shipping_address: {
      full_name: 'Aditya Deshmukh',
      city: 'Bandra West, Mumbai',
      country: 'India',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'ord_seed_102',
    order_number: 'SD-ORD-519284',
    user_id: 'usr_sneha_02',
    user_email: 'sneha.patil@fashionpulse.in',
    items: [
      {
        id: 'item_102_1',
        product_id: 'a1b2c3d4-0002-0002-0002-000000000002',
        name: 'Shadow High Archive',
        slug: 'shadow-high',
        price: 34999.0,
        image_url: '/images/shadow-high.jpg',
        size: 'UK 10 / US 11',
        quantity: 1,
      },
    ],
    total_amount: 34999.0,
    status: 'preparing_dispatch',
    shipping_address: {
      full_name: 'Sneha Patil',
      city: 'Koramangala, Bangalore',
      country: 'India',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    id: 'ord_seed_103',
    order_number: 'SD-ORD-391024',
    user_id: 'usr_vikram_03',
    user_email: 'vikram.mehta@studio.in',
    items: [
      {
        id: 'item_103_1',
        product_id: 'a1b2c3d4-0003-0003-0003-000000000003',
        name: 'Velocity Neo',
        slug: 'velocity',
        price: 24500.0,
        image_url: '/images/velocity.jpg',
        size: 'UK 8.5 / US 9.5',
        quantity: 1,
      },
      {
        id: 'item_103_2',
        product_id: 'a1b2c3d4-0004-0004-0004-000000000004',
        name: 'Obsidian Low Prime',
        slug: 'obsidian-low',
        price: 26000.0,
        image_url: '/images/obsidian-low.jpg',
        size: 'UK 8.5 / US 9.5',
        quantity: 1,
      },
    ],
    total_amount: 50500.0,
    status: 'confirmed',
    shipping_address: {
      full_name: 'Vikram Mehta',
      city: 'Connaught Place, New Delhi',
      country: 'India',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'ord_seed_104',
    order_number: 'SD-ORD-184910',
    user_id: 'usr_rohan_04',
    user_email: 'rohan.tandon@designlab.org',
    items: [
      {
        id: 'item_104_1',
        product_id: 'a1b2c3d4-0005-0005-0005-000000000005',
        name: 'Meridian Sculpt Runner',
        slug: 'meridian-runner',
        price: 32000.0,
        image_url: '/images/meridian-runner.jpg',
        size: 'UK 9 / US 10',
        quantity: 1,
      },
    ],
    total_amount: 32000.0,
    status: 'delivered',
    shipping_address: {
      full_name: 'Rohan Tandon',
      city: 'Jubilee Hills, Hyderabad',
      country: 'India',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];

declare global {
  var __SNEAKER_DATA_STORE__: LocalStoreData | undefined;
}

function loadStore(): LocalStoreData {
  if (globalThis.__SNEAKER_DATA_STORE__) {
    return globalThis.__SNEAKER_DATA_STORE__;
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      globalThis.__SNEAKER_DATA_STORE__ = {
        waitlist: parsed.waitlist || INITIAL_WAITLIST,
        orders: parsed.orders || INITIAL_ORDERS,
      };
      return globalThis.__SNEAKER_DATA_STORE__;
    }
  } catch {
    // ignore
  }

  globalThis.__SNEAKER_DATA_STORE__ = {
    waitlist: [...INITIAL_WAITLIST],
    orders: [...INITIAL_ORDERS],
  };

  saveStore(globalThis.__SNEAKER_DATA_STORE__);
  return globalThis.__SNEAKER_DATA_STORE__;
}

function saveStore(data: LocalStoreData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // ignore in environments without write permissions
  }
}

// ----------------- Waitlist Operations -----------------

export function getLocalWaitlistEntries(): WaitlistEntry[] {
  const store = loadStore();
  // Ensure product info is populated
  return store.waitlist.map((entry) => {
    if (!entry.product || !entry.product.name) {
      const prod = FALLBACK_PRODUCTS.find((p) => p.id === entry.product_id);
      return {
        ...entry,
        product: prod ? { id: prod.id, name: prod.name, slug: prod.slug } : entry.product,
      };
    }
    return entry;
  });
}

export function addLocalWaitlistEntry(params: {
  product_id: string;
  email: string;
  normalized_email: string;
}): { success: boolean; entry?: WaitlistEntry; alreadyRegistered?: boolean } {
  const store = loadStore();

  const existing = store.waitlist.find(
    (e) =>
      e.product_id === params.product_id &&
      e.normalized_email.toLowerCase() === params.normalized_email.toLowerCase()
  );

  if (existing) {
    return { success: false, alreadyRegistered: true };
  }

  const prod = FALLBACK_PRODUCTS.find((p) => p.id === params.product_id);

  const newEntry: WaitlistEntry = {
    id: `wl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    product_id: params.product_id,
    email: params.email,
    normalized_email: params.normalized_email,
    created_at: new Date().toISOString(),
    product: prod ? { id: prod.id, name: prod.name, slug: prod.slug } : undefined,
  };

  store.waitlist.unshift(newEntry);
  saveStore(store);

  return { success: true, entry: newEntry };
}

// ----------------- Orders Operations -----------------

export function getLocalOrders(): Order[] {
  const store = loadStore();
  return store.orders;
}

export function addLocalOrder(order: Order): Order {
  const store = loadStore();
  const existingIdx = store.orders.findIndex((o) => o.id === order.id || o.order_number === order.order_number);
  if (existingIdx >= 0) {
    store.orders[existingIdx] = order;
  } else {
    store.orders.unshift(order);
  }
  saveStore(store);
  return order;
}

export function updateLocalOrderStatus(orderId: string, status: OrderStatus): boolean {
  const store = loadStore();
  const order = store.orders.find((o) => o.id === orderId || o.order_number === orderId);
  if (order) {
    order.status = status;
    saveStore(store);
    return true;
  }
  return false;
}
