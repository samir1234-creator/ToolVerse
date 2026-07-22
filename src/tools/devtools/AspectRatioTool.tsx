import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { CopyField } from '@/components/tools/CopyField';
import { haptics } from '@/utils/haptics';

export default function AspectRatioTool() {
  const [ratioW, setRatioW] = useState('16');
  const [ratioH, setRatioH] = useState('9');
  const [width, setWidth] = useState('1920');

  const rw = parseFloat(ratioW) || 16;
  const rh = parseFloat(ratioH) || 9;
  const w = parseFloat(width) || 0;

  const calculatedH = rw > 0 ? Math.round((w * rh) / rw) : 0;

  const presets = [
    { label: '16:9 HD', w: 16, h: 9 },
    { label: '4:3 Standard', w: 4, h: 3 },
    { label: '1:1 Square', w: 1, h: 1 },
    { label: '9:16 Vertical', w: 9, h: 16 },
    { label: '21:9 Ultrawide', w: 21, h: 9 },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Aspect Ratio Calculator" subtitle="Calculate responsive image/video dimensions" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5">
          {presets.slice(0, 3).map((p) => (
            <button
              key={p.label}
              onClick={() => {
                haptics.light();
                setRatioW(String(p.w));
                setRatioH(String(p.h));
              }}
              className="rounded-xl py-2 text-[11px] font-bold bg-[var(--color-surface)] border border-[var(--color-line)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Ratio Width</label>
              <input
                type="number"
                value={ratioW}
                onChange={(e) => setRatioW(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Ratio Height</label>
              <input
                type="number"
                value={ratioH}
                onChange={(e) => setRatioH(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Target Width (PX)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-3 font-mono text-xl font-bold text-[var(--color-text)] focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <CopyField label="Calculated Height" value={`${calculatedH} px`} />
          <CopyField label="Full Dimension" value={`${w} x ${calculatedH} px`} />
        </div>
      </div>
    </motion.div>
  );
}
