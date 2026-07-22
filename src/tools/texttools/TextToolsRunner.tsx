import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { EmptyState } from '@/components/ui/EmptyState';
import { RotateCcw } from 'lucide-react';
import { pageVariants } from '@/animations/variants';
import { getToolById } from '@/constants/tools';

function transform(id: string, text: string, caseMode: string) {
  switch (id) {
    case 'character-counter':
      return null;
    case 'word-counter':
      return null;
    case 'reverse-text':
      return Array.from(text).reverse().join('');
    case 'remove-spaces':
      return text.replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n').trim();
    case 'case-converter':
      if (caseMode === 'upper') return text.toUpperCase();
      if (caseMode === 'lower') return text.toLowerCase();
      if (caseMode === 'title') return text.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
      if (caseMode === 'sentence') return text.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
      return text;
    default:
      return text;
  }
}

export default function TextToolsRunner() {
  const { id = '' } = useParams();
  const tool = getToolById(id);
  const [text, setText] = useState('');
  const [caseMode, setCaseMode] = useState('upper');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g)?.length ?? (text.trim() ? 1 : 0)) : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { chars, charsNoSpaces, words, sentences, readingTime };
  }, [text]);

  if (!tool) {
    return (
      <div>
        <PageHeader title="Not found" />
        <EmptyState icon={RotateCcw} title="Tool not found" description="This tool may have moved." />
      </div>
    );
  }

  const isCounter = id === 'character-counter' || id === 'word-counter';
  const output = isCounter ? null : transform(id, text, caseMode);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title={tool.name} subtitle={tool.description} />
      <div className="space-y-4 px-4 pb-28 pt-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text…"
          rows={6}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />

        {id === 'case-converter' && (
          <div className="grid grid-cols-4 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5">
            {(['upper', 'lower', 'title', 'sentence'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setCaseMode(m)}
                className={`rounded-xl py-2 text-xs font-medium capitalize transition-colors ${caseMode === m ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'}`}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {isCounter ? (
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Words', stats.words],
              ['Characters', stats.chars],
              ['Characters (no spaces)', stats.charsNoSpaces],
              ['Sentences', stats.sentences],
              ['Reading Time', `${stats.readingTime} min`],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-2xl bg-[var(--color-surface)] p-4">
                <p className="text-[13px] font-medium text-[var(--color-text-muted)]">{label}</p>
                <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-[var(--color-accent)]">{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <CopyField label="Output" value={output ?? ''} mono={false} />
        )}
      </div>
    </motion.div>
  );
}
