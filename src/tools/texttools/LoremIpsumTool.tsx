import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { CopyField } from '@/components/tools/CopyField';
import { RefreshCw } from 'lucide-react';
import { haptics } from '@/utils/haptics';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
  'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate'
];

export default function LoremIpsumTool() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [generated, setGenerated] = useState(() => generateText(3, 'paragraphs'));

  function generateText(num: number, u: 'paragraphs' | 'sentences' | 'words') {
    if (u === 'words') {
      const words: string[] = [];
      for (let i = 0; i < num; i++) {
        words.push(LOREM_WORDS[i % LOREM_WORDS.length]);
      }
      return words.join(' ');
    }
    if (u === 'sentences') {
      const sentences: string[] = [];
      for (let i = 0; i < num; i++) {
        const sentenceWords = LOREM_WORDS.slice(i % 10, (i % 10) + 7).join(' ');
        sentences.push(sentenceWords.charAt(0).toUpperCase() + sentenceWords.slice(1) + '.');
      }
      return sentences.join(' ');
    }
    // paragraphs
    const paragraphs: string[] = [];
    for (let p = 0; p < num; p++) {
      const sentenceCount = 4;
      const sArr: string[] = [];
      for (let s = 0; s < sentenceCount; s++) {
        const start = (p * 5 + s * 3) % 25;
        const sentenceWords = LOREM_WORDS.slice(start, start + 8).join(' ');
        sArr.push(sentenceWords.charAt(0).toUpperCase() + sentenceWords.slice(1) + '.');
      }
      paragraphs.push(sArr.join(' '));
    }
    return paragraphs.join('\n\n');
  }

  const handleGenerate = () => {
    haptics.medium();
    setGenerated(generateText(count, unit));
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Lorem Ipsum Generator" subtitle="Generate dummy placeholder text for UI layouts" />
      <div className="space-y-4 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 space-y-3 shadow-sm">
          <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-[var(--color-surface-2)] p-1">
            {(['paragraphs', 'sentences', 'words'] as const).map((u) => (
              <button
                key={u}
                onClick={() => {
                  haptics.light();
                  setUnit(u);
                }}
                className={`rounded-xl py-2 text-[11px] font-semibold capitalize transition-all ${
                  unit === u ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Count ({count})</span>
            <input
              type="range"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="flex-1 accent-[var(--color-accent)]"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] py-3 text-xs font-bold text-white shadow-md"
          >
            <RefreshCw size={15} /> Generate Lorem Ipsum
          </button>
        </div>

        <CopyField label="Generated Text" value={generated} mono={false} />
      </div>
    </motion.div>
  );
}
