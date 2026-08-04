import { useState } from 'react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { X, ZoomIn } from 'lucide-react';
import type { GalleryImage } from '@/lib/types';

interface GalleryProps {
  images: GalleryImage[];
}

export function Gallery({ images }: GalleryProps) {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  return (
    <Section id="gallery" className="bg-cream-100">
      <SectionHeading
        eyebrow="Gallery"
        title="A Taste of the Experience"
        subtitle="Step inside Food Junction — the food, the space, the moments."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setLightbox(img)}
            className={`group relative overflow-hidden rounded-xl bg-ink-200 ${
              idx % 5 === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <img
              src={img.image_url}
              alt={img.caption ?? 'Gallery image'}
              className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                idx % 5 === 0 ? 'h-full min-h-[280px]' : 'h-48'
              }`}
            />
            <div className="absolute inset-0 bg-ink-950/0 group-hover:bg-ink-950/40 transition-colors flex items-center justify-center">
              <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {img.caption && (
              <p className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-ink-950/80 to-transparent text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {img.caption}
              </p>
            )}
          </button>
        ))}
      </div>

      {images.length === 0 && (
        <p className="text-center text-ink-400 py-12">No gallery images yet.</p>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-ink-950/90 backdrop-blur-sm flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-white/80 hover:text-white" aria-label="Close">
            <X size={32} />
          </button>
          <img
            src={lightbox.image_url}
            alt={lightbox.caption ?? 'Gallery image'}
            className="max-w-full max-h-[85vh] rounded-xl object-contain"
          />
          {lightbox.caption && (
            <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-lg">{lightbox.caption}</p>
          )}
        </div>
      )}
    </Section>
  );
}
