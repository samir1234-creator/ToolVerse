import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { pageVariants } from '@/animations/variants';

const VALUES: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

function toRoman(num: number): string {
  let result = '';
  let n = num;
  for (const [value, symbol] of VALUES) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}

function fromRoman(roman: string): number | null {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  const clean = roman.toUpperCase().trim();
  if (!clean || !/^[IVXLCDM]+$/.test(clean)) return null;
  let total = 0;
  for (let i = 0; i < clean.length; i++) {
    const current = map[clean[i]];
    const next = map[clean[i + 1]];
    if (next && current < next) total -= current;
    else total += current;
  }
  return total;
}

export default function RomanNumeralsTool() {
  const [mode, setMode] = useState<'toRoman' | 'toNumber'>('toRoman');
  const [input, setInput] = useState('');

  const output = useMemo(() => {
    if (!input) return '';
    if (mode === 'toRoman') {
      const n = parseInt(input, 10);
      if (Number.isNaN(n) || n <= 0 || n > 3999) return 'Enter 1–3999';
      return toRoman(n);
    }
    const n = fromRoman(input);
    return n === null ? 'Invalid roman numeral' : String(n);
  }, [input, mode]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Roman Numerals" subtitle="Number ↔ Roman numeral" />
      <div className="space-y-4 px-4 pb-28 pt-5">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5">
          <button
            onClick={() => setMode('toRoman')}
            className={`rounded-xl py-2.5 text-sm font-medium transition-colors ${mode === 'toRoman' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'}`}
          >
            Number → Roman
          </button>
          <button
            onClick={() => setMode('toNumber')}
            className={`rounded-xl py-2.5 text-sm font-medium transition-colors ${mode === 'toNumber' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'}`}
          >
            Roman → Number
          </button>
        </div>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'toRoman' ? 'e.g. 1994' : 'e.g. MCMXCIV'}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 font-mono text-lg text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />

        <CopyField label="Result" value={output} />
      </div>
    </motion.div>
  );
}
