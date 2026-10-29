-- ============================================================
-- Seed: 12 Premium Sneakers for SneakerDrop Catalogue
-- Safe to re-run — uses ON CONFLICT (id) DO UPDATE
-- ============================================================

insert into public.products (id, name, slug, description, price, image_url, availability)
values
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'Court One Luxury',
    'court-one',
    'The Court One is where legacy begins. Crafted from premium full-grain Italian leather with a vulcanised rubber outsole, it carries decades of heritage into every step. Features tonal waxed cotton laces and an ultra-plush memory foam insole.',
    28999.00,
    '/images/court-one-hero.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'Shadow High Archive',
    'shadow-high',
    'Born in the shadows, built for the spotlight. The Shadow High features an extended ankle collar, hand-stitched Japanese nubuck panels, and a carbon-fibre shank plate. Its muted monochrome palette makes it the most sought-after drop in our archive.',
    34999.00,
    '/images/shadow-high.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'Velocity Neo',
    'velocity',
    'Speed redefined. The Velocity Neo breaks the mould with an ultra-light aerodynamic knit chassis, asymmetric lock-down lacing, and dual-density supercritical foam. Drop incoming — join the waitlist to secure priority release access.',
    24500.00,
    '/images/velocity.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0004-0004-0004-000000000004',
    'Obsidian Low Prime',
    'obsidian-low',
    'Dark materials, razor-sharp execution. The Obsidian Low is precision-cut from oiled tumbled leather with reinforced topstitching and a gum rubber cupsole. Versatile, durable, and uncompromisingly understated.',
    26000.00,
    '/images/obsidian-low.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0005-0005-0005-000000000005',
    'Meridian Sculpt Runner',
    'meridian-runner',
    'Archival 90s running DNA fused with modern street architecture. An open-cell technical mesh upper over a sculpted architectural midsole creates all-day comfort. Dropping in limited quantities worldwide.',
    32000.00,
    '/images/meridian-runner.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0006-0006-0006-000000000006',
    'Element Zero Prototype',
    'element-zero',
    'A study in reduction. Stripped of all superfluous branding, the Element Zero pairs matte technical nylon with raw calfskin overlays on a modular split-sole platform. Strictly limited release — now entirely sold out.',
    38500.00,
    '/images/element-zero.jpg',
    'available'
  ),
  (
    'a1b2c3d4-0007-0007-0007-000000000007',
    'Apex Trail 90',
    'apex-trail-90',
    'Gorpcore meets luxury. Engineered with waterproof Cordura mesh, quick-pull Kevlar speed lacing, and an aggressive Vibram Megagrip lugged outsole for seamless transitions between alpine trails and city streets.',
    27500.00,
    '/images/apex-trail.jpg',
    'upcoming'
  ),
  (
    'a1b2c3d4-0008-0008-0008-000000000008',
    'Ghost Knit Retro',
    'ghost-knit-retro',
    'Effortless lightweight lifestyle silhouette. Constructed with a seamless mono-weave jacquard knit upper that hugs your foot like a second skin, anchored by responsive air-infused cushioning.',
    23500.00,
    '/images/ghost-knit.jpg',
    'upcoming'
  ),
  (
    'a1b2c3d4-0009-0009-0009-000000000009',
    'Komorebi Luxe Edition',
    'komorebi-luxe',
    'An artisan collaboration combining Okayama selvedge denim, vegetable-tanned Vachetta leather, and hand-burnished brass hardware. Aged to perfection as you wear it. Limited to 300 numbered pairs.',
    33000.00,
    '/images/komorebi-luxe.jpg',
    'upcoming'
  ),
  (
    'a1b2c3d4-0010-0010-0010-000000000010',
    'Stratum Low Deconstruct',
    'stratum-low',
    'Inside-out construction. Exposed foam tongues, inverted seams, and hand-distressed detailing make the Stratum Low a raw, sculptural masterwork. Sold out worldwide within minutes of its original drop.',
    29500.00,
    '/images/stratum-low.jpg',
    'upcoming'
  ),
  (
    'a1b2c3d4-0011-0011-0011-000000000011',
    'Vortex Prime Sprint',
    'vortex-prime',
    'High-performance energy return wrapped in runway aesthetics. Features metallic graphite finish with an energy-returning carbon fiber sprint plate and reflective detailing.',
    26500.00,
    '/images/vortex-prime.jpg',
    'sold_out'
  ),
  (
    'a1b2c3d4-0012-0012-0012-000000000012',
    'Chalk Court 88 Studio',
    'hyperion-high-88',
    'Archival 1988 pro court championship silhouette reissued with modern internal ergonomics. Heavyweight 2.2mm full-grain leather, padded collar, and vintage off-white aged cupsole finish. Limited collector edition.',
    36999.00,
    '/images/court-one-profile.jpg',
    'sold_out'
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  availability = excluded.availability;
