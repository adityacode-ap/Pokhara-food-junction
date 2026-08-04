import { UtensilsCrossed, Lock } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings | null;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="bg-ink-950 text-ink-300 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ember-600 flex items-center justify-center">
              <UtensilsCrossed size={20} className="text-white" />
            </div>
            <div>
              <p className="font-serif text-lg font-bold text-white">{settings?.restaurant_name ?? 'Food Junction'}</p>
              <p className="text-sm text-ink-400">{settings?.tagline}</p>
            </div>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <a href="#menu" className="hover:text-ember-400 transition-colors">Menu</a>
            <a href="#gallery" className="hover:text-ember-400 transition-colors">Gallery</a>
            <a href="#reviews" className="hover:text-ember-400 transition-colors">Reviews</a>
            <a href="#location" className="hover:text-ember-400 transition-colors">Visit</a>
          </nav>

          <a href="/admin" className="inline-flex items-center gap-1.5 text-ink-500 hover:text-ember-400 transition-colors text-sm">
            <Lock size={14} /> Staff Login
          </a>
        </div>

        <div className="border-t border-ink-800 mt-8 pt-6 text-center text-sm text-ink-500">
          <p>&copy; {new Date().getFullYear()} {settings?.restaurant_name ?? 'Food Junction'}. All rights reserved.</p>
          <p className="mt-1">{settings?.address}</p>
        </div>
      </div>
    </footer>
  );
}
