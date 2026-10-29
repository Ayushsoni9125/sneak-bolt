import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import type { Product } from '@/types';

const mockProduct: Product = {
  id: 'a1b2c3d4-0001-0001-0001-000000000001',
  name: 'Court One',
  slug: 'court-one',
  description: 'Heritage leather court shoe crafted for timeless style.',
  price: 195.0,
  image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  availability: 'available',
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

describe('ProductCard', () => {
  it('renders product name, price, and description', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Court One')).toBeInTheDocument();
    expect(screen.getByText('₹195.00')).toBeInTheDocument();
    expect(screen.getByText(/Heritage leather court shoe/i)).toBeInTheDocument();
  });

  it('links to the correct product detail page slug', () => {
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link', { name: /view court one/i });
    expect(link).toHaveAttribute('href', '/sneakers/court-one');
  });

  it('renders availability badge with status', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('renders Add to Cart button and updates state when clicked', () => {
    render(<ProductCard product={mockProduct} />);

    const addToCartBtn = screen.getByRole('button', { name: /add court one to cart/i });
    expect(addToCartBtn).toBeInTheDocument();
    expect(addToCartBtn).toHaveTextContent(/add to cart/i);

    fireEvent.click(addToCartBtn);
    expect(screen.getByText(/added to cart/i)).toBeInTheDocument();
  });
});
