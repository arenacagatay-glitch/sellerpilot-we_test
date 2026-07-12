import type { ButtonHTMLAttributes, ReactNode } from 'react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl bg-white p-4 shadow-card ${className}`}>{children}</div>
  );
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const styles =
    variant === 'primary'
      ? 'bg-brand text-white hover:bg-brand-dark'
      : variant === 'danger'
        ? 'bg-red-50 text-red-600 hover:bg-red-100'
        : 'bg-slate-100 text-ink hover:bg-slate-200';
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 ${styles} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

// Makro rozetleri (protein / karb / yağ)
export function MacroPills({
  protein,
  carbs,
  fat,
  size = 'sm',
}: {
  protein: number;
  carbs: number;
  fat: number;
  size?: 'sm' | 'md';
}) {
  const pad = size === 'md' ? 'px-2.5 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className={`rounded-md bg-protein/10 font-semibold text-protein ${pad}`}>P {Math.round(protein)}g</span>
      <span className={`rounded-md bg-carbs/10 font-semibold text-carbs ${pad}`}>K {Math.round(carbs)}g</span>
      <span className={`rounded-md bg-fat/10 font-semibold text-fat ${pad}`}>Y {Math.round(fat)}g</span>
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
      {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
    </div>
  );
}
