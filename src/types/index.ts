export type Availability = 'available' | 'sold_out' | 'upcoming';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  availability: Availability;
  created_at: string;
  updated_at: string;
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

export interface AdminStats {
  total_products: number;
  available_products: number;
  sold_out_products: number;
  upcoming_products: number;
  total_waitlist: number;
}
