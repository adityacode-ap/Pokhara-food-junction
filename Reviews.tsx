import { Section, SectionHeading } from '@/components/ui/Section';
import { StarRating } from '@/components/ui/StarRating';
import { Quote, Users, Clock, Armchair } from 'lucide-react';
import type { Review } from '@/lib/types';

interface ReviewsProps {
  reviews: Review[];
}

export function Reviews({ reviews }: ReviewsProps) {
  const approved = reviews.filter((r) => r.is_approved);

  const avg = (field: 'rating_food' | 'rating_service' | 'rating_atmosphere') =>
    approved.length ? (approved.reduce((s, r) => s + r[field], 0) / approved.length).toFixed(1) : '—';

  return (
    <Section id="reviews" className="bg-cream-50">
      <SectionHeading
        eyebrow="Food Reviews"
        title="What Our Guests Say"
        subtitle="Real reviews from real visitors — on Google and beyond."
      />

      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
        {[
          { label: 'Food', value: avg('rating_food') },
          { label: 'Service', value: avg('rating_service') },
          { label: 'Atmosphere', value: avg('rating_atmosphere') },
        ].map((stat) => (
          <div key={stat.label} className="text-center bg-cream-100 rounded-2xl p-6 border border-ink-100">
            <p className="font-serif text-4xl font-bold text-ember-600">{stat.value}</p>
            <p className="text-ink-500 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {approved.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-ink-100 flex flex-col">
            <Quote className="text-ember-300 mb-4" size={28} />

            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-ember-100 text-ember-700 font-semibold flex items-center justify-center">
                {review.author_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-ink-900">{review.author_name}</p>
                {review.author_location && (
                  <p className="text-xs text-ink-400">{review.author_location}</p>
                )}
              </div>
            </div>

            <p className="text-ink-600 text-sm leading-relaxed flex-1 mb-4">{review.body}</p>

            <div className="space-y-1.5 border-t border-ink-100 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-400">Food</span>
                <StarRating value={review.rating_food} size={12} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-400">Service</span>
                <StarRating value={review.rating_service} size={12} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-400">Atmosphere</span>
                <StarRating value={review.rating_atmosphere} size={12} />
              </div>
            </div>

            {(review.group_size || review.wait_time || review.seating_type) && (
              <div className="flex flex-wrap gap-2 mt-4">
                {review.group_size && (
                  <span className="inline-flex items-center gap-1 text-xs bg-ink-50 text-ink-500 px-2.5 py-1 rounded-full">
                    <Users size={12} /> {review.group_size}
                  </span>
                )}
                {review.wait_time && (
                  <span className="inline-flex items-center gap-1 text-xs bg-ink-50 text-ink-500 px-2.5 py-1 rounded-full">
                    <Clock size={12} /> {review.wait_time}
                  </span>
                )}
                {review.seating_type && (
                  <span className="inline-flex items-center gap-1 text-xs bg-ink-50 text-ink-500 px-2.5 py-1 rounded-full">
                    <Armchair size={12} /> {review.seating_type}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {approved.length === 0 && (
        <p className="text-center text-ink-400 py-12">No reviews yet.</p>
      )}
    </Section>
  );
}
