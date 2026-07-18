import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-text-muted)]"
      >
        <Icon size={28} strokeWidth={1.6} />
      </motion.div>
      <p className="font-display text-base font-medium text-[var(--color-text)]">{title}</p>
      {description && <p className="max-w-[240px] text-sm text-[var(--color-text-muted)]">{description}</p>}
    </div>
  );
}
