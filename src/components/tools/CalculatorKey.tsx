import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { haptics } from '@/utils/haptics';
import { scaleTapCircle, scaleTapSmall } from '@/animations/variants';

interface KeyProps {
  onPress: () => void;
  children: ReactNode;
  variant?: 'default' | 'operator' | 'accent' | 'muted';
  shape?: 'rounded' | 'circle';
  className?: string;
}

const variantStyles: Record<string, { base: string; glow: string }> = {
  default: {
    base: 'bg-[var(--color-surface-2)] text-[var(--color-text)]',
    glow: 'hover:bg-[var(--color-surface-3)]',
  },
  operator: {
    base: 'text-[var(--color-accent)]',
    glow: 'hover:shadow-[0_0_16px_var(--color-accent-glow)]',
  },
  accent: {
    base: 'text-white',
    glow: 'hover:shadow-[0_0_24px_var(--color-accent-glow)]',
  },
  muted: {
    base: 'bg-transparent text-[var(--color-text-muted)]',
    glow: '',
  },
};

export function CalculatorKey({
  onPress,
  children,
  variant = 'default',
  shape = 'rounded',
  className = '',
}: KeyProps) {
  const { base, glow } = variantStyles[variant];
  const isCircle = shape === 'circle';
  const isAccent = variant === 'accent';
  const isOperator = variant === 'operator';

  const bgStyle = isAccent
    ? { background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', boxShadow: '0 4px 20px #8b5cf640, inset 0 1px 0 #ffffff20' }
    : isOperator
    ? { background: 'linear-gradient(135deg, #1e2030 0%, #252840 100%)', boxShadow: '0 2px 12px #8b5cf620, inset 0 1px 0 #8b5cf615, 0 0 0 1px #8b5cf625' }
    : {};

  return (
    <motion.button
      whileTap={isCircle ? scaleTapCircle : scaleTapSmall}
      whileHover={{ scale: 1.04 }}
      onClick={() => {
        haptics.light();
        onPress();
      }}
      style={bgStyle}
      className={`
        relative flex items-center justify-center font-display text-xl font-medium
        transition-shadow duration-200 select-none
        ${isCircle ? 'rounded-full aspect-square' : 'rounded-2xl'}
        ${base} ${glow} ${className}
      `}
    >
      {/* Inner shimmer for accent */}
      {isAccent && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40"
          style={{ background: 'linear-gradient(135deg, #ffffff30 0%, transparent 60%)' }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
