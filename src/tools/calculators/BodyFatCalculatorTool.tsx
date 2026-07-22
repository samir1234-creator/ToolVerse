import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { HeartPulse } from 'lucide-react';
import { haptics } from '@/utils/haptics';

export default function BodyFatCalculatorTool() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [heightCm, setHeightCm] = useState('175');
  const [waistCm, setWaistCm] = useState('85');
  const [neckCm, setNeckCm] = useState('38');
  const [hipCm, setHipCm] = useState('95');

  const h = parseFloat(heightCm) || 0;
  const w = parseFloat(waistCm) || 0;
  const n = parseFloat(neckCm) || 0;
  const hp = parseFloat(hipCm) || 0;

  // US Navy Body Fat Formula
  let bodyFatPct = 0;
  if (h > 0 && w > n) {
    if (gender === 'male') {
      bodyFatPct = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else if (hp > 0 && w + hp > n) {
      bodyFatPct = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.221 * Math.log10(h)) - 450;
    }
  }

  bodyFatPct = Math.max(3, Math.min(60, bodyFatPct));

  const getCategory = (bf: number, g: string) => {
    if (g === 'male') {
      if (bf < 6) return 'Essential Fat';
      if (bf < 14) return 'Athletes';
      if (bf < 18) return 'Fitness';
      if (bf < 25) return 'Average';
      return 'Obese';
    } else {
      if (bf < 14) return 'Essential Fat';
      if (bf < 21) return 'Athletes';
      if (bf < 25) return 'Fitness';
      if (bf < 32) return 'Average';
      return 'Obese';
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Body Fat Percentage Calculator" subtitle="US Navy method body composition & fitness metric" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5">
          {(['male', 'female'] as const).map((g) => (
            <button
              key={g}
              onClick={() => {
                haptics.light();
                setGender(g);
              }}
              className={`rounded-xl py-2 text-xs font-bold capitalize transition-all ${
                gender === g ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-text-muted)]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-3.5 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase block mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase block mb-1">Neck (cm)</label>
              <input
                type="number"
                value={neckCm}
                onChange={(e) => setNeckCm(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase block mb-1">Waist (cm)</label>
              <input
                type="number"
                value={waistCm}
                onChange={(e) => setWaistCm(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            {gender === 'female' && (
              <div>
                <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase block mb-1">Hip (cm)</label>
                <input
                  type="number"
                  value={hipCm}
                  onChange={(e) => setHipCm(e.target.value)}
                  className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Result Card */}
        <div className="rounded-3xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-6 text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] block">
            Estimated Body Fat %
          </span>
          <h2 className="text-4xl font-extrabold font-mono text-[var(--color-text)]">
            {bodyFatPct.toFixed(1)}%
          </h2>
          <p className="text-xs font-bold text-[var(--color-accent)]">
            Fitness Level: {getCategory(bodyFatPct, gender)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
