import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, GalleryImage, MenuItem, Review, SiteSettings } from '@/lib/types';

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    setSettings(data as SiteSettings | null);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { settings, loading, refresh };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    setCategories(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { categories, loading, refresh };
}

export function useMenuItems() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('menu_items').select('*').order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { items, loading, refresh };
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    setReviews(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { reviews, loading, refresh };
}

export function useGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase.from('gallery').select('*').order('sort_order');
    setImages(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  return { images, loading, refresh };
}
