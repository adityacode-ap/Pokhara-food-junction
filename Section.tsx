import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, children, className = '' }: SectionProps) {
  return (
    <section id={id} className={`px-6 py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, center = true }: SectionHeadingProps) {
  return (
    <div className={`${center ? 'mx-auto text-center' : ''} max-w-2xl mb-12`}>
      {eyebrow && (
        <p className="text-ember-600 font-semibold text-sm uppercase tracking-[0.2em] mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-4xl md:text-5xl font-bold text-ink-900 text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-ink-500 text-lg leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
