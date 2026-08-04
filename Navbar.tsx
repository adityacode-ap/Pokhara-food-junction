import { useEffect, useState } from 'react';
import { Menu, X, UtensilsCrossed } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Visit', href: '#location' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-lg shadow-ink-900/5' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-6xl px-6 h-16 md:h-20 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${scrolled ? 'bg-ember-600' : 'bg-white/20 backdrop-blur-sm'}`}>
            <UtensilsCrossed size={20} className={scrolled ? 'text-white' : 'text-white'} />
          </div>
          <span className={`font-serif text-xl font-bold transition-colors ${scrolled ? 'text-ink-900' : 'text-white'}`}>
            Food Junction
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-ember-600 ${scrolled ? 'text-ink-700' : 'text-white/90'}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          className={`md:hidden ${scrolled ? 'text-ink-900' : 'text-white'}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-cream-50 border-t border-ink-100 px-6 py-4 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-ink-700 font-medium hover:text-ember-600"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
