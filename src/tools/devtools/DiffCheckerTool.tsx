import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { GitCompare } from 'lucide-react';

export default function DiffCheckerTool() {
  const [textA, setTextA] = useState('const value = 100;\nconsole.log(value);');
  const [textB, setTextB] = useState('const value = 200;\nconsole.log("Result:", value);');

  const diff = useMemo(() => {
    const linesA = textA.split('\n');
    const linesB = textB.split('\n');
    const maxLen = Math.max(linesA.length, linesB.length);
    const result: { type: 'same' | 'added' | 'removed' | 'changed'; original?: string; modified?: string }[] = [];

    for (let i = 0; i < maxLen; i++) {
      const a = linesA[i];
      const b = linesB[i];

      if (a === b) {
        result.push({ type: 'same', original: a });
      } else if (a !== undefined && b !== undefined) {
        result.push({ type: 'changed', original: a, modified: b });
      } else if (a !== undefined) {
        result.push({ type: 'removed', original: a });
      } else if (b !== undefined) {
        result.push({ type: 'added', modified: b });
      }
    }
    return result;
  }, [textA, textB]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Text & Code Diff Checker" subtitle="Compare two text blocks and highlight line differences" />
      <div className="space-y-4 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Original Text</label>
            <textarea
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] p-3 font-mono text-xs text-[var(--color-text)] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Modified Text</label>
            <textarea
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] p-3 font-mono text-xs text-[var(--color-text)] focus:outline-none"
            />
          </div>
        </div>

        {/* Diff Output */}
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 space-y-1.5 font-mono text-xs max-h-64 overflow-y-auto">
          <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2 font-display">
            Comparison Results
          </span>
          {diff.map((item, idx) => {
            if (item.type === 'same') {
              return <div key={idx} className="text-[var(--color-text-muted)] opacity-70 px-2 py-1">{item.original}</div>;
            }
            if (item.type === 'changed') {
              return (
                <div key={idx} className="space-y-1">
                  <div className="bg-rose-500/20 text-rose-300 px-2 py-1 rounded">- {item.original}</div>
                  <div className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">+ {item.modified}</div>
                </div>
              );
            }
            if (item.type === 'removed') {
              return <div key={idx} className="bg-rose-500/20 text-rose-300 px-2 py-1 rounded">- {item.original}</div>;
            }
            if (item.type === 'added') {
              return <div key={idx} className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">+ {item.modified}</div>;
            }
            return null;
          })}
        </div>
      </div>
    </motion.div>
  );
}
