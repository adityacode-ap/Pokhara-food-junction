import { Section, SectionHeading } from '@/components/ui/Section';
import { ExternalLink, MapPin, Phone, Mail } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

interface LocationProps {
  settings: SiteSettings | null;
}

export function Location({ settings }: LocationProps) {
  const mapUrl = settings?.map_embed_url ?? 'https://www.google.com/maps?q=6X6G%2BXM2,+Phewa+Marga,+Pokhara+33700&output=embed';
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=6X6G%2BXM2,+Phewa+Marga,+Pokhara+33700';

  return (
    <Section id="location" className="bg-cream-100">
      <SectionHeading
        eyebrow="Visit Us"
        title="Find Food Junction"
        subtitle="Right at Pokhara Zero Kilometer — easy to reach, hard to forget."
      />

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3 rounded-2xl overflow-hidden shadow-xl shadow-ink-900/10 border border-ink-100">
          <iframe
            title="Food Junction location"
            src={mapUrl}
            className="w-full h-[400px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="md:col-span-2 flex flex-col justify-center space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-ember-100 text-ember-600 flex items-center justify-center shrink-0">
              <MapPin size={22} />
            </div>
            <div>
              <p className="text-sm text-ink-400 font-medium uppercase tracking-wide mb-1">Address</p>
              <p className="text-ink-700">{settings?.address ?? '6X6G+XM2, Phewa Marga, Pokhara 33700'}</p>
            </div>
          </div>

          {settings?.phone && (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-ember-100 text-ember-600 flex items-center justify-center shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <p className="text-sm text-ink-400 font-medium uppercase tracking-wide mb-1">Phone</p>
                <p className="text-ink-700">{settings.phone}</p>
              </div>
            </div>
          )}

          {settings?.email && (
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-ember-100 text-ember-600 flex items-center justify-center shrink-0">
                <Mail size={22} />
              </div>
              <div>
                <p className="text-sm text-ink-400 font-medium uppercase tracking-wide mb-1">Email</p>
                <p className="text-ink-700">{settings.email}</p>
              </div>
            </div>
          )}

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-ember-600 hover:bg-ember-700 text-white px-6 py-3.5 rounded-full font-semibold transition-all hover:scale-105 mt-2"
          >
            Get Directions <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </Section>
  );
}
