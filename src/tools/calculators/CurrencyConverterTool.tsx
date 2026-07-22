import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { ArrowUpDown, DollarSign } from 'lucide-react';
import { haptics } from '@/utils/haptics';

const RATES: Record<string, { name: string; symbol: string; rateToUsd: number }> = {
  USD: { name: 'US Dollar', symbol: '$', rateToUsd: 1.0 },
  EUR: { name: 'Euro', symbol: '€', rateToUsd: 1.08 },
  INR: { name: 'Indian Rupee', symbol: '₹', rateToUsd: 0.012 },
  GBP: { name: 'British Pound', symbol: '£', rateToUsd: 1.27 },
  JPY: { name: 'Japanese Yen', symbol: '¥', rateToUsd: 0.0065 },
  CAD: { name: 'Canadian Dollar', symbol: 'CA$', rateToUsd: 0.73 },
  AUD: { name: 'Australian Dollar', symbol: 'A$', rateToUsd: 0.65 },
  CHF: { name: 'Swiss Franc', symbol: 'CHF', rateToUsd: 1.12 },
  CNY: { name: 'Chinese Yuan', symbol: '¥', rateToUsd: 0.14 },
  AED: { name: 'UAE Dirham', symbol: 'AED', rateToUsd: 0.27 },
  SGD: { name: 'Singapore Dollar', symbol: 'S$', rateToUsd: 0.74 },
  BRL: { name: 'Brazilian Real', symbol: 'R$', rateToUsd: 0.18 },
};

export default function CurrencyConverterTool() {
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [amount, setAmount] = useState('100');

  const converted = useMemo(() => {
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return 0;
    const fromRate = RATES[from]?.rateToUsd ?? 1;
    const toRate = RATES[to]?.rateToUsd ?? 1;
    const amountInUsd = val * fromRate;
    return amountInUsd / toRate;
  }, [amount, from, to]);

  const swap = () => {
    haptics.light();
    setFrom(to);
    setTo(from);
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Currency Converter" subtitle="Convert top world currencies with rate metrics" />
      <div className="space-y-5 px-4 pb-28 pt-5 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1.5">
              Amount
            </label>
            <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-surface-2)] px-4 py-3 border border-[var(--color-line)]">
              <DollarSign size={20} className="text-[var(--color-accent)] shrink-0" />
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent font-mono text-2xl font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                From
              </label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm font-semibold text-[var(--color-text)]"
              >
                {Object.keys(RATES).map((code) => (
                  <option key={code} value={code}>
                    {code} - {RATES[code].name}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              whileTap={{ scale: 0.88, rotate: 180 }}
              onClick={swap}
              className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent)] text-white shadow-md"
            >
              <ArrowUpDown size={16} />
            </motion.button>

            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                To
              </label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm font-semibold text-[var(--color-text)]"
              >
                {Object.keys(RATES).map((code) => (
                  <option key={code} value={code}>
                    {code} - {RATES[code].name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-accent-soft)] p-6 text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            Converted Value
          </span>
          <h2 className="text-4xl font-extrabold font-mono text-[var(--color-text)] tracking-tight">
            {RATES[to]?.symbol} {converted.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            1 {from} = {(RATES[from].rateToUsd / RATES[to].rateToUsd).toFixed(4)} {to}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
