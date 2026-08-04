import { Star, Flame, ArrowRight } from 'lucide-react';
import type { MenuItem } from '@/lib/types';

interface SpecialDishProps {
  items: MenuItem[];
}

export function SpecialDish({ items }: SpecialDishProps) {
  const cheeseMomo = items.find(
    (i) => i.name.toLowerCase().includes('cheese momo') && i.is_available
  );

  if (!cheeseMomo) return null;

  return (
    <section className="relative bg-ink-950 overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-ember-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-ember-800/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image side */}
          <div className="relative order-2 md:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-ember-900/30">
              <img
                src={cheeseMomo.image_url ?? 'https://images.pexels.com/photos/3926123/pexels-photo-3926123.jpeg?auto=compress&cs=tinysrgb&w=900'}
                alt={cheeseMomo.name}
                className="w-full h-[360px] md:h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
            </div>

            {/* Price badge */}
            <div className="absolute -bottom-5 -left-5 bg-ember-600 text-white rounded-2xl px-6 py-4 shadow-xl">
              <p className="text-xs uppercase tracking-wide text-ember-100">Starting at</p>
              <p className="font-serif text-2xl font-bold">Rs. {Number(cheeseMomo.price).toFixed(0)}</p>
            </div>

            {/* Rating badge */}
            <div className="absolute -top-5 -right-5 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={14} className="fill-ember-500 text-ember-500" />
              ))}
            </div>
          </div>

          {/* Text side */}
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 bg-ember-600/15 text-ember-400 rounded-full px-4 py-1.5 mb-6">
              <Flame size={16} />
              <span className="text-sm font-semibold uppercase tracking-wide">Our Signature Dish</span>
            </div>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
              {cheeseMomo.name}
            </h2>

            <p className="text-cream-200 text-lg leading-relaxed mb-6">
              {cheeseMomo.description ??
                'Steamed dumplings filled with melted cheese and herbs — the dish that keeps our guests coming back.'}
            </p>

            <div className="space-y-3 mb-8">
              {[
                'Melted cheese filling, unique to Food Junction',
                'Recommended by our top reviewers on Google',
                'Pairs perfectly with our baby pizza',
              ].map((point) => (
                <div key={point} className="flex items-center gap-3 text-ink-200">
                  <div className="w-5 h-5 rounded-full bg-ember-600/20 flex items-center justify-center shrink-0">
                    <Star size={11} className="fill-ember-500 text-ember-500" />
                  </div>
                  <span className="text-sm">{point}</span>
                </div>
              ))}
            </div>

            <a
              href="#menu"
              className="inline-flex items-center gap-2 bg-ember-600 hover:bg-ember-700 text-white px-7 py-3.5 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-ember-600/30"
            >
              See Full Menu <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
