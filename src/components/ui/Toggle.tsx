import { motion } from 'framer-motion';
import { haptics } from '@/utils/haptics';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => {
        haptics.light();
        onChange(!checked);
      }}
      className="relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200"
      style={{ background: checked ? 'var(--color-accent)' : 'var(--color-surface-2)' }}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
        style={{ left: checked ? 26 : 4 }}
      />
    </button>
  );
}
