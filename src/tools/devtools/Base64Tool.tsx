import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { pageVariants } from '@/animations/variants';

export default function Base64Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');

  const output = useMemo(() => {
    try {
      if (!input) return '';
      return mode === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)));
    } catch {
      return 'Invalid input for this mode';
    }
  }, [input, mode]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Base64" subtitle="Encode & decode text" />
      <div className="space-y-4 px-4 pb-28 pt-5">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-xl py-2.5 text-sm font-medium capitalize transition-colors ${mode === m ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'}`}
            >
              {m}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === 'encode' ? 'Type text to encode…' : 'Paste Base64 to decode…'}
          rows={5}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 font-mono text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />

        <CopyField label="Output" value={output} />
      </div>
    </motion.div>
  );
}
