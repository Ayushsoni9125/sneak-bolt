export type Availability = 'available' | 'sold_out' | 'upcoming';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  availability: Availability;
  category?: string;
  colorway?: string;
  sku?: string;
  materials?: string;
  gallery?: string[];
  stock_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  size: string;
  colorway?: string;
  quantity: number;
}

export interface WaitlistEntry {
  id: string;
  product_id: string;
  email: string;
  normalized_email: string;
  created_at: string;
  product?: Pick<Product, 'id' | 'name' | 'slug'>;
}

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  size: string;
  quantity: number;
}

export type OrderStatus = 'confirmed' | 'preparing_dispatch' | 'in_transit' | 'delivered';

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  user_email?: string;
  items: OrderItem[];
  total_amount: number;
  status: OrderStatus;
  shipping_address?: {
    full_name?: string;
    city?: string;
    country?: string;
  };
  created_at: string;
}

export interface AdminStats {
  total_products: number;
  available_products: number;
  sold_out_products: number;
  upcoming_products: number;
  total_waitlist: number;
}
