import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { Toggle } from '@/components/ui/Toggle';
import { pageVariants, scaleTap } from '@/animations/variants';
import { haptics } from '@/utils/haptics';

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(length: number, opts: Record<keyof typeof SETS, boolean>) {
  const pool = (Object.keys(opts) as (keyof typeof SETS)[]).filter((k) => opts[k]).map((k) => SETS[k]).join('');
  if (!pool) return '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (n) => pool[n % pool.length]).join('');
}

export default function PasswordGeneratorTool() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ lower: true, upper: true, numbers: true, symbols: true });
  const [password, setPassword] = useState(() => generatePassword(16, { lower: true, upper: true, numbers: true, symbols: true }));

  const strength = useMemo(() => {
    const variety = Object.values(opts).filter(Boolean).length;
    const score = variety * length;
    if (score > 60) return { label: 'Strong', color: 'var(--color-success)' };
    if (score > 30) return { label: 'Good', color: 'var(--color-warm)' };
    return { label: 'Weak', color: 'var(--color-danger)' };
  }, [opts, length]);

  const regenerate = (nextLength = length, nextOpts = opts) => {
    haptics.medium();
    setPassword(generatePassword(nextLength, nextOpts));
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Password Generator" subtitle="Strong, random, offline" />
      <div className="space-y-4 px-4 pb-28 pt-5">
        <CopyField label={`Strength: ${strength.label}`} value={password} />

        <div className="rounded-2xl bg-[var(--color-surface)] p-4">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--color-text-muted)]">Length</span>
            <span className="font-mono text-sm font-semibold text-[var(--color-text)]">{length}</span>
          </div>
          <input
            type="range"
            min={6}
            max={32}
            value={length}
            onChange={(e) => {
              const v = Number(e.target.value);
              setLength(v);
              regenerate(v, opts);
            }}
            className="w-full accent-[var(--color-accent)]"
          />
        </div>

        <div className="space-y-1 rounded-2xl bg-[var(--color-surface)] p-2">
          {(
            [
              ['lower', 'Lowercase (a-z)'],
              ['upper', 'Uppercase (A-Z)'],
              ['numbers', 'Numbers (0-9)'],
              ['symbols', 'Symbols (!@#$)'],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between px-3 py-2.5">
              <span className="text-[15px] text-[var(--color-text)]">{label}</span>
              <Toggle
                checked={opts[key]}
                onChange={(v) => {
                  const next = { ...opts, [key]: v };
                  setOpts(next);
                  regenerate(length, next);
                }}
              />
            </div>
          ))}
        </div>

        <motion.button whileTap={scaleTap} onClick={() => regenerate()} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-accent)] py-3 text-sm font-semibold text-white">
          <RefreshCw size={16} /> Generate New Password
        </motion.button>
      </div>
    </motion.div>
  );
}
