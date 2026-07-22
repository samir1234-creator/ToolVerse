import { useState } from 'react';
import { motion } from 'framer-motion';
import { Dices } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { pageVariants, scaleTap } from '@/animations/variants';
import { haptics } from '@/utils/haptics';

export default function RandomNumberTool() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('5');
  const [unique, setUnique] = useState(true);
  const [results, setResults] = useState<number[]>([]);

  const generate = () => {
    haptics.medium();
    const lo = Math.ceil(parseFloat(min));
    const hi = Math.floor(parseFloat(max));
    const n = Math.max(1, Math.min(50, parseInt(count, 10) || 1));
    if (Number.isNaN(lo) || Number.isNaN(hi) || hi < lo) {
      setResults([]);
      return;
    }
    if (unique) {
      const range = hi - lo + 1;
      const size = Math.min(n, range);
      const pool = Array.from({ length: range }, (_, i) => lo + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      setResults(pool.slice(0, size));
    } else {
      setResults(Array.from({ length: n }, () => Math.floor(Math.random() * (hi - lo + 1)) + lo));
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Random Number" subtitle="Pick numbers in any range" />
      <div className="space-y-4 px-4 pb-28 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-muted)]">Min</span>
            <input value={min} onChange={(e) => setMin(e.target.value)} type="number" className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 font-mono text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-muted)]">Max</span>
            <input value={max} onChange={(e) => setMax(e.target.value)} type="number" className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 font-mono text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none" />
          </label>
        </div>

        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-muted)]">How Many (max 50)</span>
          <input value={count} onChange={(e) => setCount(e.target.value)} type="number" className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 font-mono text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none" />
        </label>

        <label className="flex items-center justify-between rounded-2xl bg-[var(--color-surface)] px-4 py-3">
          <span className="text-[15px] text-[var(--color-text)]">No duplicates</span>
          <input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} className="h-5 w-5 accent-[var(--color-accent)]" />
        </label>

        <motion.button whileTap={scaleTap} onClick={generate} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] py-3 text-sm font-semibold text-white">
          <Dices size={16} /> Generate
        </motion.button>

        {results.length > 0 && <CopyField label="Results" value={results.join(', ')} />}
      </div>
    </motion.div>
  );
}
