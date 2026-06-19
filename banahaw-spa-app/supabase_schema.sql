-- ============================================
-- Banahaw Spa — Database Schema
-- Run this once in Supabase SQL Editor
-- (Project > SQL Editor > New query > paste > Run)
-- ============================================

-- 1. SERVICES (massage treatments + prices)
create table services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  duration text,
  price text,
  icon text default 'massage',
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- 2. GALLERY IMAGES
create table gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int default 0,
  active boolean default true,
  created_at timestamptz default now()
);

-- 3. SITE CONTENT (key-value text blocks: hero headline, about text, hours, etc.)
create table site_content (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,  -- e.g. 'hero_headline', 'about_text', 'phone', 'address'
  content text,
  updated_at timestamptz default now()
);

-- 4. BOOKINGS (customer form submissions)
create table bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service text,
  preferred_date date,
  preferred_time time,
  message text,
  status text default 'new', -- new, confirmed, completed, cancelled
  created_at timestamptz default now()
);

-- 5. ADMIN USERS handled by Supabase Auth (no custom table needed)

-- ============================================
-- ROW LEVEL SECURITY
-- Public can READ services/gallery/content, and INSERT bookings.
-- Only authenticated admin can WRITE to services/gallery/content,
-- and READ/UPDATE bookings.
-- ============================================

alter table services enable row level security;
alter table gallery_images enable row level security;
alter table site_content enable row level security;
alter table bookings enable row level security;

-- Public read access (so the live website can display content)
create policy "Public can view active services" on services
  for select using (active = true);
create policy "Public can view active gallery" on gallery_images
  for select using (active = true);
create policy "Public can view site content" on site_content
  for select using (true);

-- Public can submit bookings (insert only — they can't read others' bookings)
create policy "Public can submit bookings" on bookings
  for insert with check (true);

-- Authenticated admin (logged in via Supabase Auth) full access
create policy "Admin full access services" on services
  for all using (auth.role() = 'authenticated');
create policy "Admin full access gallery" on gallery_images
  for all using (auth.role() = 'authenticated');
create policy "Admin full access content" on site_content
  for all using (auth.role() = 'authenticated');
create policy "Admin full access bookings" on bookings
  for all using (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA — initial services matching the original site
-- ============================================

insert into services (name, description, duration, price, sort_order) values
('Swedish Massage', 'Long, flowing strokes that ease everyday tension and improve circulation.', '60 / 90 min', '₱500', 1),
('Deep Tissue Massage', 'Firm, targeted pressure that releases chronic knots and muscle tightness.', '60 / 90 min', '₱650', 2),
('Shiatsu Massage', 'Finger-pressure technique balancing energy flow along pressure points.', '60 / 90 min', '₱600', 3),
('Hot Stone Massage', 'Warmed volcanic stones glide over tense muscles, melting away stress.', '75 / 90 min', '₱850', 4),
('Aromatherapy Massage', 'Essential-oil blends paired with calming strokes.', '60 / 90 min', '₱700', 5),
('Foot Reflexology', 'Pressure-point therapy on the feet to relieve fatigue.', '30 / 60 min', '₱350', 6),
('Ventosa Therapy', 'Traditional Filipino cupping technique that draws out tension.', '30 / 45 min', '₱400', 7),
('Couple Massage Package', 'Side-by-side treatment rooms for partners or friends.', '60 / 90 min', '₱1,800', 8);

insert into site_content (section_key, content) values
('hero_headline', 'Relax, Rejuvenate, and Restore Your Well-Being'),
('hero_subheadline', 'Professional massage therapy and wellness services rooted in Filipino healing tradition — minutes from Calamba City, Laguna.'),
('about_text', 'Banahaw Spa was founded to give working professionals, students, local families, and visiting tourists a dependable space for therapeutic massage and genuine rest.'),
('phone', '+63 917 123 4567'),
('email', 'hello@banahawspa.ph'),
('address', '123 Banahaw Street, Brgy. Real, Calamba City, Laguna 4027, Philippines'),
('hours_weekday', '10:00 AM – 10:00 PM'),
('hours_weekend', '9:00 AM – 10:00 PM'),
('facebook_url', 'https://facebook.com/banahawspa'),
('instagram_url', 'https://instagram.com/banahawspa'),
('messenger_url', 'https://m.me/banahawspa');
