export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Review {
  id: string;
  author_name: string;
  author_location: string | null;
  rating_food: number;
  rating_service: number;
  rating_atmosphere: number;
  body: string;
  visit_date: string | null;
  group_size: string | null;
  wait_time: string | null;
  seating_type: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

export interface OpeningHours {
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

export interface SiteSettings {
  id: number;
  restaurant_name: string;
  tagline: string | null;
  about: string | null;
  address: string | null;
  map_embed_url: string | null;
  phone: string | null;
  email: string | null;
  opening_hours: OpeningHours | null;
  updated_at: string;
}
