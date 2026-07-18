import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { haptics } from '@/utils/haptics';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, action, onBack }: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="glass-strong sticky top-0 z-30 border-b border-[var(--color-line)] px-4 pb-4.5 pt-[calc(env(safe-area-inset-top)+32px)]"
      style={{ boxShadow: '0 4px 24px #8b5cf610' }}
    >
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.85, rotate: -5 }}
          onClick={() => {
            haptics.light();
            onBack ? onBack() : navigate(-1);
          }}
          aria-label="Go back"
          className="relative -ml-2 flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-muted)]"
          style={{ background: 'var(--color-surface-2)' }}
        >
          <ChevronLeft size={20} />
        </motion.button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-lg font-semibold leading-tight text-[var(--color-text)]">{title}</h1>
          {subtitle && (
            <p className="truncate text-xs text-[var(--color-text-muted)] mt-0.5">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </motion.header>
  );
}
