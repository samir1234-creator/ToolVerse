import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { CopyField } from '@/components/tools/CopyField';
import { haptics } from '@/utils/haptics';

export default function TextCleanerTool() {
  const [input, setInput] = useState('banana\napple\nbanana\n  cherry  \n<p>orange</p>');
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [sortAlphabetically, setSortAlphabetically] = useState(true);
  const [stripHtml, setStripHtml] = useState(true);
  const [trimLines, setTrimLines] = useState(true);

  const cleaned = useMemo(() => {
    let text = input;
    if (stripHtml) {
      text = text.replace(/<[^>]*>/g, '');
    }
    let lines = text.split('\n');
    if (trimLines) {
      lines = lines.map((l) => l.trim()).filter((l) => l.length > 0);
    }
    if (removeDuplicates) {
      lines = Array.from(new Set(lines));
    }
    if (sortAlphabetically) {
      lines.sort((a, b) => a.localeCompare(b));
    }
    return lines.join('\n');
  }, [input, removeDuplicates, sortAlphabetically, stripHtml, trimLines]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Text Cleaner & Line Sorter" subtitle="Deduplicate, sort alphabetically & strip HTML tags" />
      <div className="space-y-4 px-4 pb-28 pt-4 max-w-md mx-auto">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder="Paste unorganized text or list here..."
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 font-mono text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
        />

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface)] p-3 border border-[var(--color-line)] text-xs font-semibold">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeDuplicates}
              onChange={(e) => {
                haptics.light();
                setRemoveDuplicates(e.target.checked);
              }}
              className="accent-[var(--color-accent)] h-4 w-4"
            />
            <span>Remove Duplicates</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sortAlphabetically}
              onChange={(e) => {
                haptics.light();
                setSortAlphabetically(e.target.checked);
              }}
              className="accent-[var(--color-accent)] h-4 w-4"
            />
            <span>Sort A-Z</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={stripHtml}
              onChange={(e) => {
                haptics.light();
                setStripHtml(e.target.checked);
              }}
              className="accent-[var(--color-accent)] h-4 w-4"
            />
            <span>Strip HTML Tags</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => {
                haptics.light();
                setTrimLines(e.target.checked);
              }}
              className="accent-[var(--color-accent)] h-4 w-4"
            />
            <span>Trim Spaces</span>
          </label>
        </div>

        <CopyField label="Cleaned Text Output" value={cleaned} />
      </div>
    </motion.div>
  );
}
