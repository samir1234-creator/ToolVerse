import { AnimatePresence, motion } from 'framer-motion';
import { Copy, Share2 } from 'lucide-react';
import type { ResultRow } from '@/types';
import { haptics } from '@/utils/haptics';
import { snackbar } from './Snackbar';

interface ResultCardProps {
  rows: ResultRow[] | null;
  toolName: string;
}

export function ResultCard({ rows, toolName }: ResultCardProps) {
  const shareText = rows ? `${toolName}\n${rows.map((r) => `${r.label}: ${r.value}`).join('\n')}` : '';

  const copy = async () => {
    haptics.light();
    try {
      await navigator.clipboard.writeText(shareText);
      snackbar('Copied to clipboard');
    } catch {
      snackbar('Could not copy');
    }
  };

  const share = async () => {
    haptics.light();
    try {
      if (navigator.share) {
        await navigator.share({ text: shareText, title: toolName });
      } else {
        await navigator.clipboard.writeText(shareText);
        snackbar('Copied — sharing not supported here');
      }
    } catch {
      // user cancelled share, no-op
    }
  };

  return (
    <div className="rounded-3xl bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[13px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">Result</span>
        {rows && (
          <div className="flex gap-1.5">
            <button onClick={copy} aria-label="Copy result" className="rounded-full p-2 text-[var(--color-text-muted)] active:bg-[var(--color-surface-2)]">
              <Copy size={16} />
            </button>
            <button onClick={share} aria-label="Share result" className="rounded-full p-2 text-[var(--color-text-muted)] active:bg-[var(--color-surface-2)]">
              <Share2 size={16} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {rows ? (
          <motion.div
            key={shareText}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-2.5"
          >
            {rows.map((row, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3">
                <span className={`text-[13.5px] ${row.emphasis ? 'text-[var(--color-text)]' : 'text-[var(--color-text-muted)]'}`}>
                  {row.label}
                </span>
                <span
                  className={`tabular-nums font-mono ${row.emphasis ? 'text-2xl font-semibold text-[var(--color-accent)]' : 'text-[15px] font-medium text-[var(--color-text)]'}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: 'left' }}
              className="mt-1 h-0.5 rounded-full bg-[var(--color-accent)]"
            />
          </motion.div>
        ) : (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-6 text-center text-sm text-[var(--color-text-muted)]"
          >
            Fill in the values above to see your result
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
