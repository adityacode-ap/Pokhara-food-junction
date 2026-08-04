import { ChevronDown, MapPin, Star } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

interface HeroProps {
  settings: SiteSettings | null;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/3926123/pexels-photo-3926123.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Nepali momo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-900/60 to-ink-950/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center pt-20">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
          <MapPin size={14} className="text-ember-400" />
          <span className="text-white/90 text-sm font-medium">Pokhara Zero K.M.</span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-up text-balance">
          {settings?.restaurant_name ?? 'Food Junction'}
        </h1>

        <p className="text-xl md:text-2xl text-cream-100 font-light mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          {settings?.tagline ?? 'Taste Pokhara at the heart of Zero Kilometer.'}
        </p>

        <div className="flex items-center justify-center gap-1 mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} size={20} className="fill-ember-400 text-ember-400" />
          ))}
          <span className="text-white/80 text-sm ml-2">Loved by locals & travelers</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <a
            href="#menu"
            className="bg-ember-600 hover:bg-ember-700 text-white px-8 py-3.5 rounded-full font-semibold transition-all hover:scale-105 hover:shadow-xl hover:shadow-ember-600/30"
          >
            Explore Our Menu
          </a>
          <a
            href="#location"
            className="bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-semibold transition-all"
          >
            Find Us
          </a>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} />
      </a>
    </section>
  );
}
