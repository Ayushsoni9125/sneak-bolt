-- ============================================================
-- Seed: Initial product data for SneakerDrop
-- Safe to re-run — uses ON CONFLICT DO NOTHING
-- ============================================================

insert into public.products (id, name, slug, description, price, image_url, availability)
values
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Court One',
    'court-one',
    'The Court One is where legacy begins. Crafted from premium full-grain leather with a vulcanised outsole, it carries decades of heritage into every step. The tonal lacing system and clean profile make it timeless in any era. Available in limited colourways for those who understand restraint.',
    195.00,
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=85',
    'available'
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Shadow High',
    'shadow-high',
    'Born in the shadows, built for the spotlight. The Shadow High features an extended ankle collar, hand-stitched suede panels, and a carbon-fibre reinforced sole unit. Its muted palette and architectural silhouette make it the most sought-after release in our archive. Sold out in all sizes.',
    285.00,
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=85',
    'sold_out'
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Velocity',
    'velocity',
    'Speed has a new silhouette. The Velocity redefines performance-inspired design with an ultra-light knit upper, asymmetric lacing, and a responsive foam compound developed over two years. Drop incoming — join the waitlist to be first in line when it releases.',
    320.00,
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=85',
    'upcoming'
  ),
  (
    'a1b2c3d4-0004-0004-0004-000000000004',
    'Obsidian Low',
    'obsidian-low',
    'Dark materials, precise construction. The Obsidian Low is cut from tumbled nubuck with contrast stitching and a gum rubber outsole. Clean lines run from heel to toe, and the subtlety is the point. Wear it with everything, apologise to no one.',
    215.00,
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=85',
    'available'
  ),
  (
    'a1b2c3d4-0005-0005-0005-000000000005',
    'Meridian Runner',
    'meridian-runner',
    'The Meridian Runner bridges archival running aesthetics with modern construction. A mesh upper over a sculpted EVA midsole creates the kind of comfortable silhouette that works equally well on the track and the pavement. A long-awaited reissue, dropping soon.',
    240.00,
    'https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=800&q=85',
    'upcoming'
  )
on conflict (id) do nothing;
