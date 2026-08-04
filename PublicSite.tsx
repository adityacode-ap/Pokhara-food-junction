import { Navbar } from '@/components/public/Navbar';
import { Hero } from '@/components/public/Hero';
import { SpecialDish } from '@/components/public/SpecialDish';
import { About } from '@/components/public/About';
import { MenuSection } from '@/components/public/MenuSection';
import { Gallery } from '@/components/public/Gallery';
import { Reviews } from '@/components/public/Reviews';
import { Location } from '@/components/public/Location';
import { Footer } from '@/components/public/Footer';
import { useCategories, useGallery, useMenuItems, useReviews, useSiteSettings } from '@/lib/hooks';

export function PublicSite() {
  const { settings } = useSiteSettings();
  const { categories } = useCategories();
  const { items } = useMenuItems();
  const { reviews } = useReviews();
  const { images } = useGallery();

  return (
    <>
      <Navbar />
      <Hero settings={settings} />
      <SpecialDish items={items} />
      <About settings={settings} />
      <MenuSection categories={categories} items={items} />
      <Gallery images={images} />
      <Reviews reviews={reviews} />
      <Location settings={settings} />
      <Footer settings={settings} />
    </>
  );
}
