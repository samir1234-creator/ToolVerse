import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Code, AlertCircle } from 'lucide-react';

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('Contact support@toolverse.app or john.doe@example.com for help.');

  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: null };
    try {
      const regex = new RegExp(pattern, flags);
      const matches: { text: string; index: number }[] = [];
      let match;
      if (flags.includes('g')) {
        while ((match = regex.exec(text)) !== null) {
          matches.push({ text: match[0], index: match.index });
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(text);
        if (match) matches.push({ text: match[0], index: match.index });
      }
      return { matches, error: null };
    } catch (err: any) {
      return { matches: [], error: err.message };
    }
  }, [pattern, flags, text]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Regex Tester & Debugger" subtitle="Test regular expression patterns with live matching" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Pattern
              </label>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="e.g. \d+"
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2.5 font-mono text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
            <div className="w-24">
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Flags
              </label>
              <input
                type="text"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="g, i, m"
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2.5 font-mono text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Test String
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] p-3 font-mono text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
            />
          </div>
        </div>

        {/* Results */}
        {result.error ? (
          <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-danger-soft)]/20 border border-[var(--color-danger)]/40 p-3.5 text-[var(--color-danger)] text-xs font-semibold">
            <AlertCircle size={16} />
            <span>Regex Error: {result.error}</span>
          </div>
        ) : (
          <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-3">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">
              Matches Found ({result.matches.length})
            </span>
            {result.matches.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)]">No matches found in test string.</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {result.matches.map((m, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-[var(--color-surface-2)] px-3.5 py-2 rounded-xl text-xs">
                    <span className="font-mono font-bold text-[var(--color-accent)] break-all">{m.text}</span>
                    <span className="text-[10px] text-[var(--color-text-muted)]">Index {m.index}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
