import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { pageVariants } from '@/animations/variants';

const BASES = [
  { id: 'dec', label: 'Decimal', base: 10 },
  { id: 'bin', label: 'Binary', base: 2 },
  { id: 'hex', label: 'Hexadecimal', base: 16 },
  { id: 'oct', label: 'Octal', base: 8 },
] as const;

export default function BinaryHexOctalTool() {
  const [source, setSource] = useState<(typeof BASES)[number]['id']>('dec');
  const [value, setValue] = useState('42');

  const parsed = useMemo(() => {
    const base = BASES.find((b) => b.id === source)!.base;
    const n = parseInt(value, base);
    return Number.isNaN(n) ? null : n;
  }, [value, source]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Binary / Hex / Octal" subtitle="Convert between number systems" />
      <div className="space-y-4 px-4 pb-28 pt-5">
        <div className="rounded-2xl bg-[var(--color-surface)] p-4">
          <span className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-muted)]">Input Base</span>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value as typeof source)}
            className="mb-3 w-full appearance-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)]"
          >
            {BASES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a number"
            className="w-full rounded-xl border border-[var(--color-line)] bg-transparent px-4 py-3 font-mono text-lg text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
          />
        </div>

        {parsed === null ? (
          <p className="text-center text-sm text-[var(--color-text-muted)]">Enter a valid number for this base</p>
        ) : (
          <div className="space-y-3">
            {BASES.map((b) => (
              <CopyField key={b.id} label={b.label} value={parsed.toString(b.base).toUpperCase()} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
