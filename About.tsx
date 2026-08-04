import { Section, SectionHeading } from '@/components/ui/Section';
import { Clock, MapPin, Phone } from 'lucide-react';
import type { SiteSettings } from '@/lib/types';

interface AboutProps {
  settings: SiteSettings | null;
}

const dayLabels: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};

export function About({ settings }: AboutProps) {
  const hours = settings?.opening_hours;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();

  return (
    <Section id="about" className="bg-cream-100">
      <SectionHeading
        eyebrow="Our Story"
        title="A Corner of Pokhara, Full of Flavor"
      />

      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-ink-900/20">
            <img
              src="https://images.pexels.com/photos/13869884/pexels-photo-13869884.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Restaurant interior"
              className="w-full h-[420px] object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-ember-600 text-white rounded-2xl p-6 shadow-xl hidden sm:block">
            <p className="font-serif text-3xl font-bold">Zero K.M.</p>
            <p className="text-ember-100 text-sm">Heart of Pokhara</p>
          </div>
        </div>

        <div>
          <p className="text-ink-700 text-lg leading-relaxed mb-6">
            {settings?.about ??
              'Pokhara Food Junction is located at one of the city\u2019s most recognizable transit points, making it an easy stop for locals, travelers, and food lovers passing through Pokhara Zero K.M.'}
          </p>
          <p className="text-ink-500 leading-relaxed mb-8">
            We serve authentic Nepali dishes \u2014 from our famous cheese momo to baby pizzas and traditional thali \u2014 in a warm, casual setting. Quick meals, relaxed visits, and genuine hospitality.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-ember-600 mt-1 shrink-0" size={20} />
              <div>
                <p className="text-sm text-ink-400 font-medium uppercase tracking-wide">Address</p>
                <p className="text-ink-700">{settings?.address ?? '6X6G+XM2, Phewa Marga, Pokhara 33700'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-ember-600 mt-1 shrink-0" size={20} />
              <div>
                <p className="text-sm text-ink-400 font-medium uppercase tracking-wide">Phone</p>
                <p className="text-ink-700">{settings?.phone ?? '+977 98XXXXXXXX'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="text-ember-600 mt-1 shrink-0" size={20} />
              <div className="flex-1">
                <p className="text-sm text-ink-400 font-medium uppercase tracking-wide mb-1">Opening Hours</p>
                <div className="space-y-0.5">
                  {hours && Object.entries(hours).map(([day, time]) => (
                    <div key={day} className={`flex justify-between text-sm ${day === today ? 'text-ember-700 font-semibold' : 'text-ink-600'}`}>
                      <span>{dayLabels[day] ?? day}</span>
                      <span>{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
