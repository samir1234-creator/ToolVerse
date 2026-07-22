import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpDown, RotateCcw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { unitCategories, convertValue } from '@/constants/converters';
import { pageVariants } from '@/animations/variants';
import { haptics } from '@/utils/haptics';

export default function UnitConverterTool() {
  const { categoryId = '' } = useParams();
  const category = unitCategories.find((c) => c.id === categoryId);

  const [from, setFrom] = useState(category?.units[0]?.id ?? '');
  const [to, setTo] = useState(category?.units[1]?.id ?? category?.units[0]?.id ?? '');
  const [input, setInput] = useState('1');

  const result = useMemo(() => {
    if (!category) return null;
    const value = parseFloat(input);
    if (Number.isNaN(value)) return null;
    return convertValue(category.id, value, from, to);
  }, [category, input, from, to]);

  if (!category) {
    return (
      <div>
        <PageHeader title="Not found" />
        <EmptyState icon={RotateCcw} title="Converter not found" description="This category may have moved." />
      </div>
    );
  }

  const swap = () => {
    haptics.light();
    setFrom(to);
    setTo(from);
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title={`${category.label} Converter`} subtitle="Instant, offline conversion" />

      <div className="space-y-4 px-4 pb-28 pt-5">
        <div className="rounded-3xl bg-[var(--color-surface)] p-5">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-muted)]">Value</span>
            <input
              type="number"
              inputMode="decimal"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent font-mono text-3xl font-semibold tabular-nums text-[var(--color-text)] focus:outline-none"
            />
          </label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-3 w-full appearance-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)]"
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center">
          <motion.button
            whileTap={{ scale: 0.9, rotate: 180 }}
            onClick={swap}
            aria-label="Swap units"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-md"
          >
            <ArrowUpDown size={18} />
          </motion.button>
        </div>

        <div className="rounded-3xl bg-[var(--color-accent-soft)] p-5">
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--color-accent)]">Result</span>
          <motion.p
            key={`${result}-${to}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="break-all font-mono text-3xl font-semibold tabular-nums text-[var(--color-text)]"
          >
            {result !== null ? result.toLocaleString('en-IN', { maximumFractionDigits: 6 }) : '—'}
          </motion.p>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-3 w-full appearance-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)]"
          >
            {category.units.map((u) => (
              <option key={u.id} value={u.id}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}
