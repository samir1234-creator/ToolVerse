import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { CopyField } from '@/components/tools/CopyField';
import { haptics } from '@/utils/haptics';

export default function HtmlEntityTool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('<p class="title">Hello & Welcome!</p>');

  const output = useMemo(() => {
    if (!input) return '';
    if (mode === 'encode') {
      return input.replace(/[\u00A0-\u9999<>&"']/g, (i) => '&#' + i.charCodeAt(0) + ';');
    } else {
      const doc = new DOMParser().parseFromString(input, 'text/html');
      return doc.documentElement.textContent || '';
    }
  }, [input, mode]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="HTML Entity Encoder/Decoder" subtitle="Convert special characters to & from HTML entities" />
      <div className="space-y-4 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5">
          {(['encode', 'decode'] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                haptics.light();
                setMode(m);
              }}
              className={`rounded-xl py-2 text-xs font-bold capitalize transition-all ${
                mode === m ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 font-mono text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
        />

        <CopyField label="Result" value={output} />
      </div>
    </motion.div>
  );
}
