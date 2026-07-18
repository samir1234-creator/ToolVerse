import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { pageVariants } from '@/animations/variants';

export default function AsciiTool() {
  const [mode, setMode] = useState<'toAscii' | 'toText'>('toAscii');
  const [input, setInput] = useState('');

  const output = useMemo(() => {
    if (!input) return '';
    try {
      if (mode === 'toAscii') {
        return Array.from(input)
          .map((c) => c.charCodeAt(0))
          .join(' ');
      }
      return input
        .trim()
        .split(/\s+/)
        .map((code) => String.fromCharCode(parseInt(code, 10)))
        .join('');
    } catch {
      return 'Invalid input';
    }
  }, [input, mode]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="ASCII Converter" subtitle="Text to codes & back" />
      <div className="space-y-4 px-4 pb-28 pt-5">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5">
          <button
            onClick={() => setMode('toAscii')}
            className={`rounded-xl py-2.5 text-sm font-medium transition-colors ${mode === 'toAscii' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'}`}
          >
            Text → ASCII
          </button>
          <button
            onClick={() => setMode('toText')}
            className={`rounded-xl py-2.5 text-sm font-medium transition-colors ${mode === 'toText' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'}`}
          >
            ASCII → Text
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'toAscii' ? 'Type text…' : 'e.g. 72 101 108 108 111'}
          rows={4}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 font-mono text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />

        <CopyField label="Output" value={output} />
      </div>
    </motion.div>
  );
}
