import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  size?: number;
  className?: string;
}

export function StarRating({ value, size = 16, className = '' }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={n <= value ? 'fill-ember-500 text-ember-500' : 'text-ink-300'}
        />
      ))}
    </div>
  );
}
