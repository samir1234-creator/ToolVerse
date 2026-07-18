import { motion } from 'framer-motion';
import { Heart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ToolMeta } from '@/types';
import { useAppStore } from '@/hooks/useAppStore';
import { haptics } from '@/utils/haptics';

interface ToolCardProps {
  tool: ToolMeta;
  variant?: 'default' | 'compact';
  showFavorite?: boolean;
}

// Per-category accent color
const categoryColor: Record<string, { color: string; bg: string }> = {
  calculators: { color: '#8b5cf6', bg: '#8b5cf618' },
  converters:  { color: '#6366f1', bg: '#6366f118' },
  devtools:    { color: '#10b981', bg: '#10b98118' },
  texttools:   { color: '#f59e0b', bg: '#f59e0b18' },
};

export function ToolCard({ tool, variant = 'default', showFavorite = true }: ToolCardProps) {
  const navigate = useNavigate();
  const isFavorite    = useAppStore((s) => s.isFavorite(tool.id));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const addRecent     = useAppStore((s) => s.addRecent);
  const Icon = tool.icon;

  const accent = categoryColor[tool.category] ?? categoryColor.calculators;

  const open = () => {
    haptics.light();
    addRecent(tool.id);
    navigate(tool.route);
  };

  /* ── Compact card (horizontal scroll strip) ── */
  if (variant === 'compact') {
    return (
      <motion.button
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: 1.03 }}
        onClick={open}
        className="flex-shrink-0 flex flex-col items-center gap-2.5 rounded-3xl px-4 py-4 text-center"
        style={{
          minWidth: '5.5rem',
          background: `linear-gradient(145deg, ${accent.bg}, ${accent.color}0a)`,
          border: `1px solid ${accent.color}28`,
          boxShadow: `0 4px 16px ${accent.color}12`,
        }}
      >
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: accent.bg, boxShadow: `0 2px 10px ${accent.color}28` }}
        >
          <Icon size={20} strokeWidth={2} color={accent.color} />
        </div>
        <span
          className="text-[11px] font-semibold leading-tight"
          style={{ color: 'var(--color-text)' }}
        >
          {tool.name}
        </span>
      </motion.button>
    );
  }

  /* ── Default card (list row) ── */
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={open}
      className="group relative flex w-full items-center gap-3.5 rounded-2xl p-3.5 text-left"
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-line)',
        boxShadow: '0 2px 10px #00000012',
      }}
    >
      {/* Subtle left accent line */}
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: `linear-gradient(180deg, ${accent.color}60, transparent)` }}
      />

      {/* Icon */}
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
        style={{ background: accent.bg, boxShadow: `0 2px 8px ${accent.color}20` }}
      >
        <Icon size={20} strokeWidth={2} color={accent.color} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-[14px] font-semibold text-[var(--color-text)]">{tool.name}</p>
        <p className="truncate text-[12px] text-[var(--color-text-muted)] mt-0.5">{tool.description}</p>
      </div>

      {/* Favorite + chevron */}
      <div className="flex items-center gap-1 shrink-0">
        {showFavorite && (
          <motion.span
            whileTap={{ scale: 0.85 }}
            role="button"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            onClick={(e) => { e.stopPropagation(); haptics.light(); toggleFavorite(tool.id); }}
            className="flex h-8 w-8 items-center justify-center rounded-full"
            style={{ background: isFavorite ? '#f59e0b15' : 'transparent' }}
          >
            <Heart
              size={15}
              fill={isFavorite ? '#f59e0b' : 'none'}
              color={isFavorite ? '#f59e0b' : 'var(--color-text-muted)'}
            />
          </motion.span>
        )}
        <ChevronRight size={15} color="var(--color-text-muted)" className="opacity-50" />
      </div>
    </motion.button>
  );
}
