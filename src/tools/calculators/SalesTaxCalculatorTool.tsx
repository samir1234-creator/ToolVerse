import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Receipt } from 'lucide-react';
import { haptics } from '@/utils/haptics';

export default function SalesTaxCalculatorTool() {
  const [amount, setAmount] = useState('150');
  const [taxRate, setTaxRate] = useState('8.875');
  const [mode, setMode] = useState<'add' | 'remove'>('add');

  const price = parseFloat(amount) || 0;
  const rate = (parseFloat(taxRate) || 0) / 100;

  let taxAmount = 0;
  let finalAmount = 0;

  if (mode === 'add') {
    taxAmount = price * rate;
    finalAmount = price + taxAmount;
  } else {
    finalAmount = price / (1 + rate);
    taxAmount = price - finalAmount;
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Sales Tax & VAT Calculator" subtitle="Add or extract tax amounts instantly" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5">
          <button
            onClick={() => {
              haptics.light();
              setMode('add');
            }}
            className={`rounded-xl py-2 text-xs font-bold transition-all ${
              mode === 'add' ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-text-muted)]'
            }`}
          >
            Add Tax (+ Tax)
          </button>
          <button
            onClick={() => {
              haptics.light();
              setMode('remove');
            }}
            className={`rounded-xl py-2 text-xs font-bold transition-all ${
              mode === 'remove' ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-text-muted)]'
            }`}
          >
            Remove Tax (Extract)
          </button>
        </div>

        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              {mode === 'add' ? 'Pre-Tax Amount ($)' : 'Total Price with Tax ($)'}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-3 font-mono text-xl font-bold text-[var(--color-text)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Sales Tax / VAT Rate (%)
            </label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-3 font-mono text-xl font-bold text-[var(--color-text)] focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-6 text-center space-y-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] block mb-1">
              {mode === 'add' ? 'Total Price (Including Tax)' : 'Pre-Tax Net Price'}
            </span>
            <h2 className="text-4xl font-extrabold font-mono text-[var(--color-text)]">
              ${finalAmount.toFixed(2)}
            </h2>
          </div>
          <div className="pt-2 border-t border-[var(--color-line)] text-xs text-[var(--color-text-muted)]">
            Tax Amount ({taxRate}%): <strong className="text-[var(--color-accent)]">${taxAmount.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
