import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { TrendingUp, Clock } from 'lucide-react';

export default function Rule72Tool() {
  const [rate, setRate] = useState('8.5');
  const [initialAmount, setInitialAmount] = useState('10000');

  const r = parseFloat(rate) || 0;
  const P = parseFloat(initialAmount) || 0;

  const yearsToDouble = r > 0 ? 72 / r : 0;
  const exactYearsToDouble = r > 0 ? Math.log(2) / Math.log(1 + r / 100) : 0;
  const doubledAmount = P * 2;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Rule of 72 Calculator" subtitle="Estimate compound interest investment doubling time" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Annual Interest / Return Rate (%)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-3 font-mono text-xl font-bold text-[var(--color-text)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Initial Investment Amount ($)
            </label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-3 font-mono text-xl font-bold text-[var(--color-text)] focus:outline-none"
            />
          </div>
        </div>

        {/* Doubling Time Card */}
        <div className="rounded-3xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-6 text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] block">
            Estimated Doubling Time
          </span>
          <h2 className="text-4xl font-extrabold font-mono text-[var(--color-text)]">
            {yearsToDouble.toFixed(1)} Years
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Exact mathematical calculation: <strong>{exactYearsToDouble.toFixed(2)} years</strong>
          </p>
        </div>

        {/* Growth Projection Card */}
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-[var(--color-line)] pb-2.5">
            <TrendingUp size={16} className="text-[var(--color-accent)]" />
            <h3 className="font-display text-sm font-semibold text-[var(--color-text)]">Growth Milestone</h3>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--color-text-muted)]">Initial Principal</span>
            <span className="font-mono font-bold text-[var(--color-text)]">${P.toLocaleString('en-US')}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[var(--color-text-muted)]">Doubled Value in {yearsToDouble.toFixed(1)} yrs</span>
            <span className="font-mono font-bold text-emerald-400">${doubledAmount.toLocaleString('en-US')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
