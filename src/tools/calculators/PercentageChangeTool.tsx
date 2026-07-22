import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Percent, TrendingUp, TrendingDown } from 'lucide-react';

export default function PercentageChangeTool() {
  const [val1, setVal1] = useState('80');
  const [val2, setVal2] = useState('110');

  const v1 = parseFloat(val1) || 0;
  const v2 = parseFloat(val2) || 0;

  const diff = v2 - v1;
  const pctChange = v1 !== 0 ? (diff / v1) * 100 : 0;
  const isIncrease = pctChange >= 0;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Percentage Change & Difference" subtitle="Calculate percentage increase, decrease & price inflation" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">From Value</label>
              <input
                type="number"
                value={val1}
                onChange={(e) => setVal1(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-3 font-mono text-xl font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">To Value</label>
              <input
                type="number"
                value={val2}
                onChange={(e) => setVal2(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-3 font-mono text-xl font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className={`rounded-3xl border p-6 text-center space-y-2 ${isIncrease ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-rose-500/30 bg-rose-500/10'}`}>
          <div className="flex justify-center items-center gap-1 text-xs font-bold uppercase tracking-wider">
            {isIncrease ? <TrendingUp size={16} className="text-emerald-400" /> : <TrendingDown size={16} className="text-rose-400" />}
            <span className={isIncrease ? 'text-emerald-400' : 'text-rose-400'}>
              {isIncrease ? 'Percentage Increase' : 'Percentage Decrease'}
            </span>
          </div>
          <h2 className={`text-4xl font-extrabold font-mono ${isIncrease ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isIncrease ? '+' : ''}{pctChange.toFixed(2)}%
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Difference: <strong className="text-[var(--color-text)]">{diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)}</strong>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
