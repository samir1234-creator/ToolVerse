import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { pageVariants } from '@/animations/variants';

const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;

async function hash(text: string, algorithm: string) {
  const data = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export default function HashGeneratorTool() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!input) {
      setHashes({});
      return;
    }
    let cancelled = false;
    (async () => {
      const results: Record<string, string> = {};
      for (const algo of ALGORITHMS) {
        results[algo] = await hash(input, algo);
      }
      if (!cancelled) setHashes(results);
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Hash Generator" subtitle="SHA-1, SHA-256, SHA-384, SHA-512" />
      <div className="space-y-4 px-4 pb-28 pt-5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste text to hash…"
          rows={4}
          className="w-full rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 font-mono text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none"
        />
        <div className="space-y-3">
          {ALGORITHMS.map((algo) => (
            <CopyField key={algo} label={algo} value={hashes[algo] ?? ''} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
