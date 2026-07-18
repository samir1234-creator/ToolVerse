import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { sheetVariants, fadeIn } from '@/animations/variants';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const handleBack = (e: Event) => {
      e.preventDefault();
      onClose();
    };
    document.addEventListener('capacitorBackButton', handleBack);
    return () => {
      document.removeEventListener('capacitorBackButton', handleBack);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50"
          />
          <motion.div
            variants={sheetVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="glass fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-[var(--color-line)] px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-3"
          >
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[var(--color-line)]" />
            {title && <h2 className="mb-3 font-display text-base font-semibold text-[var(--color-text)]">{title}</h2>}
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
