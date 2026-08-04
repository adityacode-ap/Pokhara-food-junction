import { useState } from 'react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Star } from 'lucide-react';
import type { Category, MenuItem } from '@/lib/types';

interface MenuSectionProps {
  categories: Category[];
  items: MenuItem[];
}

export function MenuSection({ categories, items }: MenuSectionProps) {
  const [activeSlug, setActiveSlug] = useState<string>('all');

  const featured = items.filter((i) => i.is_featured && i.is_available);

  const filtered = activeSlug === 'all'
    ? items.filter((i) => i.is_available)
    : items.filter((i) => i.category_id === categories.find((c) => c.slug === activeSlug)?.id && i.is_available);

  const activeCategory = categories.find((c) => c.slug === activeSlug);

  return (
    <Section id="menu" className="bg-ink-950">
      <SectionHeading
        eyebrow="Our Menu"
        title="Crafted with Local Flavor"
        subtitle="From our signature cheese momo to wood-fired pizzas — every dish is made fresh, with love."
      />

      {featured.length > 0 && activeSlug === 'all' && (
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Star size={18} className="fill-ember-500 text-ember-500" />
            <h3 className="font-serif text-2xl font-semibold text-white">Popular Picks</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map((item) => (
              <div key={item.id} className="group rounded-2xl overflow-hidden bg-ink-900 border border-ink-700 hover:border-ember-600 transition-all">
                <div className="aspect-[4/3] overflow-hidden">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-ink-800" />
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-white mb-1">{item.name}</h4>
                  <p className="text-ember-400 font-bold">Rs. {Number(item.price).toFixed(0)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        <button
          onClick={() => setActiveSlug('all')}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            activeSlug === 'all' ? 'bg-ember-600 text-white' : 'bg-ink-800 text-ink-200 hover:bg-ink-700'
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveSlug(cat.slug)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeSlug === cat.slug ? 'bg-ember-600 text-white' : 'bg-ink-800 text-ink-200 hover:bg-ink-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {activeCategory?.description && (
        <p className="text-center text-ink-300 mb-8 max-w-xl mx-auto">{activeCategory.description}</p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
        {filtered.map((item) => (
          <div key={item.id} className="py-5 border-b border-ink-700/50 group">
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="font-serif text-lg font-semibold text-white group-hover:text-ember-400 transition-colors">
                {item.name}
              </h4>
              <span className="text-ember-500 font-bold whitespace-nowrap">Rs. {Number(item.price).toFixed(0)}</span>
            </div>
            {item.description && (
              <p className="text-ink-400 text-sm mt-1 leading-relaxed">{item.description}</p>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-ink-400 py-12">No items available in this category right now.</p>
      )}
    </Section>
  );
}
