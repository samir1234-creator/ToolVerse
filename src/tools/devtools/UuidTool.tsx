import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { pageVariants, scaleTap } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import { snackbar } from '@/components/ui/Snackbar';

export default function UuidTool() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, () => crypto.randomUUID()));

  const generate = () => {
    haptics.medium();
    setUuids(Array.from({ length: count }, () => crypto.randomUUID()));
  };

  const copyAll = async () => {
    haptics.light();
    await navigator.clipboard.writeText(uuids.join('\n'));
    snackbar('All UUIDs copied');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="UUID Generator" subtitle="Version 4, cryptographically random" />
      <div className="space-y-4 px-4 pb-28 pt-5">
        <div className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] p-4">
          <span className="text-sm font-medium text-[var(--color-text-muted)]">Count</span>
          <input
            type="range"
            min={1}
            max={20}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="flex-1 accent-[var(--color-accent)]"
          />
          <span className="w-8 text-right font-mono text-sm font-semibold text-[var(--color-text)]">{count}</span>
        </div>

        <div className="flex gap-2">
          <motion.button whileTap={scaleTap} onClick={generate} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] py-3 text-sm font-semibold text-white">
            <RefreshCw size={16} /> Generate
          </motion.button>
          <motion.button whileTap={scaleTap} onClick={copyAll} className="rounded-2xl bg-[var(--color-surface-2)] px-4 py-3 text-sm font-semibold text-[var(--color-text)]">
            Copy All
          </motion.button>
        </div>

        <div className="space-y-2.5">
          {uuids.map((u, i) => (
            <CopyField key={u + i} label={`UUID ${i + 1}`} value={u} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
