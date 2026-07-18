import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { pageVariants } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [tabSize, setTabSize] = useState<2 | 4>(2);

  const parsed = useMemo(() => {
    if (!input.trim()) return { formatted: '', error: null };
    try {
      const obj = JSON.parse(input);
      return {
        formatted: JSON.stringify(obj, null, tabSize),
        error: null
      };
    } catch (err: any) {
      return {
        formatted: '',
        error: err.message
      };
    }
  }, [input, tabSize]);

  const handleMinify = () => {
    if (!input.trim() || parsed.error) return;
    haptics.medium();
    try {
      const obj = JSON.parse(input);
      setInput(JSON.stringify(obj));
    } catch {}
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="JSON Formatter & Validator" subtitle="Format, validate & clean JSON data" />
      <div className="space-y-4 px-4 pb-28 pt-5">
        
        {/* Controls */}
        <div className="flex gap-2 justify-between items-center rounded-2xl bg-[var(--color-surface)] p-3 border border-[var(--color-line)]">
          <div className="flex gap-2">
            <button
              onClick={() => { haptics.light(); setTabSize(2); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${tabSize === 2 ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}
            >
              2 Spaces
            </button>
            <button
              onClick={() => { haptics.light(); setTabSize(4); }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${tabSize === 4 ? 'bg-[var(--color-accent-soft)] text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}`}
            >
              4 Spaces
            </button>
          </div>
          
          <button
            onClick={handleMinify}
            disabled={!!parsed.error || !input.trim()}
            className="rounded-lg bg-[var(--color-surface-2)] text-[var(--color-text)] px-3 py-1.5 text-xs font-semibold active:bg-[var(--color-line)] disabled:opacity-40"
          >
            Minify JSON
          </button>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste JSON here, e.g. {"name": "ToolVerse"}'
          rows={7}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 font-mono text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />

        {/* Validation indicator */}
        {input.trim() && (
          <div className={`flex items-center gap-2 rounded-2xl p-3.5 border ${parsed.error ? 'bg-[var(--color-danger-soft)]/20 border-[var(--color-danger)]/40 text-[var(--color-danger)]' : 'bg-green-500/10 border-green-500/30 text-green-400'}`}>
            {parsed.error ? (
              <>
                <AlertCircle size={18} />
                <span className="text-xs font-semibold break-all">Invalid JSON: {parsed.error}</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span className="text-xs font-semibold">Valid JSON</span>
              </>
            )}
          </div>
        )}

        {input.trim() && !parsed.error && (
          <CopyField label="Formatted JSON" value={parsed.formatted} />
        )}
      </div>
    </motion.div>
  );
}
