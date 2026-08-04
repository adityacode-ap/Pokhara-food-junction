/*
# Food Junction — Restaurant CMS Schema

## Overview
Creates the full database for a semi-CMS restaurant website with a public site
and a staff management dashboard. Staff log in (email/password) to manage menu
items, categories, reviews, gallery images, and site settings. The public site
reads everything without logging in.

## New Tables

1. `categories` — menu categories (Momo, Pizza, Beverages, etc.)
   - `id` uuid PK
   - `name` text — category display name
   - `slug` text unique — URL-friendly identifier
   - `description` text — optional blurb shown above the category
   - `sort_order` int — display ordering (lower = first)
   - `created_at` timestamp

2. `menu_items` — individual dishes
   - `id` uuid PK
   - `category_id` uuid FK → categories (CASCADE delete)
   - `name` text — dish name
   - `description` text — optional description
   - `price` numeric(10,2) — price in NPR
   - `image_url` text — optional photo URL
   - `is_available` boolean — toggle on/off the menu
   - `is_featured` boolean — show in "Popular Picks" section
   - `sort_order` int — ordering within category
   - `created_at` timestamp

3. `reviews` — customer food reviews / ratings
   - `id` uuid PK
   - `author_name` text — reviewer name
   - `author_location` text — where they're from (optional)
   - `rating_food` int (1–5)
   - `rating_service` int (1–5)
   - `rating_atmosphere` int (1–5)
   - `body` text — review text
   - `visit_date` text — when they visited (optional)
   - `group_size` text — e.g. "3-4 people" (optional)
   - `wait_time` text — e.g. "Up to 10 min" (optional)
   - `seating_type` text — e.g. "Indoor dining area" (optional)
   - `is_approved` boolean — staff can hide/show reviews
   - `created_at` timestamp

4. `gallery` — gallery images for the photo gallery
   - `id` uuid PK
   - `image_url` text — photo URL
   - `caption` text — optional caption
   - `sort_order` int — ordering
   - `created_at` timestamp

5. `site_settings` — single-row table for editable site content
   - `id` int PK (always 1)
   - `restaurant_name` text
   - `tagline` text — short tagline under the hero
   - `about` text — about / story paragraph
   - `address` text — physical address
   - `map_embed_url` text — Google Maps embed src URL
   - `phone` text
   - `email` text
   - `opening_hours` jsonb — keyed by day
   - `updated_at` timestamp

## Security (RLS)

- RLS enabled on every table.
- Public read access (anon + authenticated) on all tables so the public site
  loads without login.
- Write access (INSERT/UPDATE/DELETE) restricted to authenticated users only,
  so only logged-in staff can manage content.
- `site_settings` follows the same pattern: public read, authenticated write.
*/

-- ===== CATEGORIES =====
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- ===== MENU ITEMS =====
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_menu_items" ON menu_items;
CREATE POLICY "public_read_menu_items" ON menu_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_menu_items" ON menu_items;
CREATE POLICY "auth_insert_menu_items" ON menu_items FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_menu_items" ON menu_items;
CREATE POLICY "auth_update_menu_items" ON menu_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_menu_items" ON menu_items;
CREATE POLICY "auth_delete_menu_items" ON menu_items FOR DELETE
  TO authenticated USING (true);

-- ===== REVIEWS =====
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL,
  author_location text,
  rating_food int NOT NULL DEFAULT 5 CHECK (rating_food BETWEEN 1 AND 5),
  rating_service int NOT NULL DEFAULT 5 CHECK (rating_service BETWEEN 1 AND 5),
  rating_atmosphere int NOT NULL DEFAULT 5 CHECK (rating_atmosphere BETWEEN 1 AND 5),
  body text NOT NULL,
  visit_date text,
  group_size text,
  wait_time text,
  seating_type text,
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_reviews" ON reviews;
CREATE POLICY "auth_insert_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_reviews" ON reviews;
CREATE POLICY "auth_update_reviews" ON reviews FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_reviews" ON reviews;
CREATE POLICY "auth_delete_reviews" ON reviews FOR DELETE
  TO authenticated USING (true);

-- ===== GALLERY =====
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery" ON gallery;
CREATE POLICY "public_read_gallery" ON gallery FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery;
CREATE POLICY "auth_insert_gallery" ON gallery FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery" ON gallery;
CREATE POLICY "auth_update_gallery" ON gallery FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery;
CREATE POLICY "auth_delete_gallery" ON gallery FOR DELETE
  TO authenticated USING (true);

-- ===== SITE SETTINGS =====
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  restaurant_name text NOT NULL DEFAULT 'Food Junction',
  tagline text,
  about text,
  address text,
  map_embed_url text,
  phone text,
  email text,
  opening_hours jsonb,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_site_settings" ON site_settings;
CREATE POLICY "auth_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_insert_site_settings" ON site_settings;
CREATE POLICY "auth_insert_site_settings" ON site_settings FOR INSERT
  TO authenticated WITH CHECK (id = 1);

-- ===== SEED DATA =====

-- Categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Momo', 'momo', 'Handcrafted dumplings — steamed, fried, or in rich jhol.', 1),
('Pizza', 'pizza', 'Wood-fired style pizzas with fresh toppings.', 2),
('Nepali Thali', 'nepali-thali', 'Traditional Nepali meals served on a platter.', 3),
('Snacks & Sides', 'snacks-sides', 'Quick bites and accompaniments.', 4),
('Beverages', 'beverages', 'Refreshing drinks to complement your meal.', 5)
ON CONFLICT (slug) DO NOTHING;

-- Menu items (linked to categories by slug)
INSERT INTO menu_items (category_id, name, description, price, image_url, is_available, is_featured, sort_order)
SELECT c.id, m.name, m.description, m.price, m.image_url, m.is_available, m.is_featured, m.sort_order
FROM (VALUES
  ('momo', 'Cheese Momo', 'Steamed dumplings filled with melted cheese and herbs — our signature dish.', 180, 'https://images.pexels.com/photos/3926123/pexels-photo-3926123.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, true, 1),
  ('momo', 'Chicken Momo', 'Classic steamed chicken dumplings with house-made chutney.', 160, 'https://images.pexels.com/photos/7918232/pexels-photo-7918232.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, true, 2),
  ('momo', 'Jhol Momo', 'Dumplings served in a spicy, tangy sesame-tomato broth.', 200, 'https://images.pexels.com/photos/33670191/pexels-photo-33670191.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, false, 3),
  ('momo', 'Fried Momo', 'Crispy golden-fried dumplings, served with spicy achar.', 190, 'https://images.pexels.com/photos/19787913/pexels-photo-19787913.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, false, 4),
  ('pizza', 'Baby Pizza', 'Personal-size pizza with mozzarella, tomato, and basil.', 220, 'https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, true, 1),
  ('pizza', 'Margherita Pizza', 'Classic mozzarella, tomato sauce, and fresh basil.', 350, 'https://images.pexels.com/photos/14030950/pexels-photo-14030950.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, false, 2),
  ('pizza', 'Cheese Burst Pizza', 'Loaded with extra molten cheese and toppings.', 420, 'https://images.pexels.com/photos/20154166/pexels-photo-20154166.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, false, 3),
  ('nepali-thali', 'Veg Thali', 'Rice, dal, seasonal vegetables, pickle, and curd.', 250, 'https://images.pexels.com/photos/36460904/pexels-photo-36460904.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, true, 1),
  ('nepali-thali', 'Chicken Thali', 'Rice, dal, chicken curry, vegetables, and pickle.', 320, 'https://images.pexels.com/photos/7804406/pexels-photo-7804406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, false, 2),
  ('nepali-thali', 'Special Thali', 'A hearty platter with multiple curries, paneer, and dessert.', 400, 'https://images.pexels.com/photos/8148149/pexels-photo-8148149.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, false, 3),
  ('snacks-sides', 'Chana Chatpate', 'Spicy tangy chickpea snack with herbs and lemon.', 80, 'https://images.pexels.com/photos/36125185/pexels-photo-36125185.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, false, 1),
  ('snacks-sides', 'French Fries', 'Crispy fries with peri-peri seasoning.', 120, 'https://images.pexels.com/photos/29148133/pexels-photo-29148133.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, false, 2),
  ('beverages', 'Fresh Lemon Soda', 'Refreshing mint lemon soda — sweet or salty.', 70, 'https://images.pexels.com/photos/35008222/pexels-photo-35008222.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, false, 1),
  ('beverages', 'Cold Coffee', 'Creamy iced coffee blended with milk.', 130, 'https://images.pexels.com/photos/30711838/pexels-photo-30711838.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', true, false, 2)
) AS m(slug, name, description, price, image_url, is_available, is_featured, sort_order)
JOIN categories c ON c.slug = m.slug
ON CONFLICT DO NOTHING;

-- Reviews
INSERT INTO reviews (author_name, author_location, rating_food, rating_service, rating_atmosphere, body, visit_date, group_size, wait_time, seating_type, is_approved, created_at) VALUES
('Timilsina Milan (Paras)', 'Local Guide · 115 reviews · 1851 photos', 5, 5, 5, 'As a favourite Nepali Dish, Momo has its own value. Despite this, this place has added more extra value on momo. The cheese momo was so tasty and was unique dish for me. Don''t forget to eat cheese momo and baby pizza at so cheap price. Peace corner with quality service. Recommend all to visit at least once, then you will automatically visit next time without my recommendation. All dishes were superb and collecting feedbacks from customer for better service next time was awesome.', 'Lunch', 'Rs 1–500', NULL, NULL, true, NOW() - INTERVAL '30 days'),
('Love Yadav', 'Janakpur', 5, 4, 3, 'Best food and best service... I from Janakpur.', '4 days ago', NULL, NULL, NULL, true, NOW() - INTERVAL '4 days'),
('Aaditya Bastola', 'Pokhara', 5, 5, 4, 'What an amazing place to enjoy food especially the special cheese momo here! The service was amazing here and the hospitality was top notch too. I recommend everyone to visit here and enjoy even a plate of chicken momo.', NULL, '3-4 people', 'Up to 10 min', 'Indoor dining area, Private dining room', true, NOW() - INTERVAL '15 days')
ON CONFLICT DO NOTHING;

-- Gallery
INSERT INTO gallery (image_url, caption, sort_order) VALUES
('https://images.pexels.com/photos/3926123/pexels-photo-3926123.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Our signature Jhol Momo', 1),
('https://images.pexels.com/photos/12181619/pexels-photo-12181619.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Cozy indoor dining', 2),
('https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Fresh Margherita pizza', 3),
('https://images.pexels.com/photos/36460904/pexels-photo-36460904.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Traditional Nepali thali', 4),
('https://images.pexels.com/photos/7918232/pexels-photo-7918232.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Steamed momo in bamboo steamers', 5),
('https://images.pexels.com/photos/13869884/pexels-photo-13869884.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Warm and inviting interior', 6),
('https://images.pexels.com/photos/20154166/pexels-photo-20154166.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Cheese burst pizza', 7),
('https://images.pexels.com/photos/19787913/pexels-photo-19787913.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 'Freshly plated momo', 8)
ON CONFLICT DO NOTHING;

-- Site settings (single row)
INSERT INTO site_settings (id, restaurant_name, tagline, about, address, map_embed_url, phone, email, opening_hours)
VALUES (
  1,
  'Food Junction',
  'Taste Pokhara at the heart of Zero Kilometer.',
  'Pokhara Food Junction is located at one of the city''s most recognizable transit points, making it an easy stop for locals, travelers, and food lovers passing through Pokhara Zero K.M. The venue is a restaurant and bar focused on local-food dining — a casual, convenient stop for quick meals and relaxed visits in central Pokhara.',
  '6X6G+XM2, Phewa Marga, Pokhara 33700',
  'https://www.google.com/maps?q=6X6G%2BXM2,+Phewa+Marga,+Pokhara+33700&output=embed',
  '+977 98XXXXXXXX',
  'hello@foodjunction.com.np',
  '{"mon":"8:00 AM – 9:00 PM","tue":"8:00 AM – 9:00 PM","wed":"8:00 AM – 9:00 PM","thu":"8:00 AM – 9:00 PM","fri":"8:00 AM – 10:00 PM","sat":"8:00 AM – 10:00 PM","sun":"9:00 AM – 9:00 PM"}'
)
ON CONFLICT (id) DO NOTHING;
