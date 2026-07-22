import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { CopyField } from '@/components/tools/CopyField';

export default function PxToRemTool() {
  const [basePx, setBasePx] = useState('16');
  const [pixels, setPixels] = useState('24');

  const base = parseFloat(basePx) || 16;
  const px = parseFloat(pixels) || 0;

  const rem = base > 0 ? (px / base).toFixed(4).replace(/\.?0+$/, '') : '0';
  const em = rem;
  const vw = (px / 19.2).toFixed(3).replace(/\.?0+$/, ''); // assuming 1920px screen width baseline
  const pt = (px * 0.75).toFixed(2).replace(/\.?0+$/, '');

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="PX to REM / EM / VW Converter" subtitle="Convert pixel values for responsive web CSS layouts" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Pixel Value (PX)
              </label>
              <input
                type="number"
                value={pixels}
                onChange={(e) => setPixels(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-3 font-mono text-xl font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Base Font Size (PX)
              </label>
              <input
                type="number"
                value={basePx}
                onChange={(e) => setBasePx(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-3 font-mono text-xl font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Output list */}
        <div className="space-y-3">
          <CopyField label="REM Value" value={`${rem}rem`} />
          <CopyField label="EM Value" value={`${em}em`} />
          <CopyField label="VW Value (1920px screen)" value={`${vw}vw`} />
          <CopyField label="Point Value (PT)" value={`${pt}pt`} />
        </div>
      </div>
    </motion.div>
  );
}
