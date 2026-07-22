import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Landmark, PiggyBank } from 'lucide-react';

export default function LoanPayoffTool() {
  const [balance, setBalance] = useState('50000');
  const [rate, setRate] = useState('7.5');
  const [minPayment, setMinPayment] = useState('600');
  const [extraPayment, setExtraPayment] = useState('200');

  const calc = useMemo(() => {
    const P = parseFloat(balance) || 0;
    const r = (parseFloat(rate) || 0) / 100 / 12;
    const minPmt = parseFloat(minPayment) || 0;
    const extraPmt = parseFloat(extraPayment) || 0;
    const totalPmt = minPmt + extraPmt;

    if (P <= 0 || r <= 0 || minPmt <= P * r) {
      return { monthsStandard: 0, monthsAccelerated: 0, interestSaved: 0, monthsSaved: 0 };
    }

    // Standard payoff months
    const nStandard = Math.ceil(-Math.log(1 - (P * r) / minPmt) / Math.log(1 + r));
    const totalInterestStandard = nStandard * minPmt - P;

    // Accelerated payoff months
    const nAccelerated = Math.ceil(-Math.log(1 - (P * r) / totalPmt) / Math.log(1 + r));
    const totalInterestAccelerated = nAccelerated * totalPmt - P;

    const interestSaved = Math.max(0, totalInterestStandard - totalInterestAccelerated);

    return {
      monthsStandard: nStandard,
      monthsAccelerated: nAccelerated,
      interestSaved,
      monthsSaved: Math.max(0, nStandard - nAccelerated),
    };
  }, [balance, rate, minPayment, extraPayment]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Early Loan Payoff Calculator" subtitle="See how extra monthly payments save thousands in interest" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Current Loan Balance ($)
            </label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-2.5 font-mono text-lg font-bold text-[var(--color-text)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-2.5 font-mono text-lg font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Min Payment ($)
              </label>
              <input
                type="number"
                value={minPayment}
                onChange={(e) => setMinPayment(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-2.5 font-mono text-lg font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider block mb-1">
              Extra Monthly Payment ($)
            </label>
            <input
              type="number"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-accent-soft)] border border-[var(--color-accent)]/30 px-4 py-2.5 font-mono text-lg font-bold text-[var(--color-text)] focus:outline-none"
            />
          </div>
        </div>

        {/* Impact Results */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block">Total Interest Saved</span>
            <span className="font-mono text-2xl font-extrabold text-[var(--color-text)] mt-1 block">
              ${calc.interestSaved.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>

          <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-center">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">Time Saved</span>
            <span className="font-mono text-2xl font-extrabold text-[var(--color-accent)] mt-1 block">
              {Math.floor(calc.monthsSaved / 12)}y {calc.monthsSaved % 12}m
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
