import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Scale, CheckCircle2 } from 'lucide-react';

export default function LoanComparisonTool() {
  const [loanA, setLoanA] = useState({ amount: '250000', rate: '6.5', years: '30' });
  const [loanB, setLoanB] = useState({ amount: '250000', rate: '5.8', years: '15' });

  const calcLoan = (amtStr: string, rateStr: string, yearsStr: string) => {
    const P = parseFloat(amtStr) || 0;
    const r = (parseFloat(rateStr) || 0) / 100 / 12;
    const n = (parseFloat(yearsStr) || 0) * 12;

    if (P <= 0 || r <= 0 || n <= 0) return { monthly: 0, totalInterest: 0, totalPayment: 0 };
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthly * n;
    const totalInterest = totalPayment - P;
    return { monthly, totalInterest, totalPayment };
  };

  const resA = useMemo(() => calcLoan(loanA.amount, loanA.rate, loanA.years), [loanA]);
  const resB = useMemo(() => calcLoan(loanB.amount, loanB.rate, loanB.years), [loanB]);

  const interestWinner = resA.totalInterest < resB.totalInterest ? 'A' : resB.totalInterest < resA.totalInterest ? 'B' : 'equal';

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Loan Offer Comparison" subtitle="Compare interest rates, monthly payments & total loan cost" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {/* Loan A */}
          <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 space-y-3">
            <span className="font-extrabold text-sm text-[var(--color-text)] block">Loan Offer A</span>
            <div>
              <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase block">Amount ($)</label>
              <input
                type="number"
                value={loanA.amount}
                onChange={(e) => setLoanA({ ...loanA, amount: e.target.value })}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-xs font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase block">Rate (%)</label>
              <input
                type="number"
                value={loanA.rate}
                onChange={(e) => setLoanA({ ...loanA, rate: e.target.value })}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-xs font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase block">Term (Years)</label>
              <input
                type="number"
                value={loanA.years}
                onChange={(e) => setLoanA({ ...loanA, years: e.target.value })}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-xs font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-[var(--color-line)] space-y-1">
              <span className="text-[10px] text-[var(--color-text-muted)] block">Monthly Payment</span>
              <span className="font-mono text-base font-bold text-[var(--color-accent)] block">${Math.round(resA.monthly).toLocaleString()}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] block">Total Interest</span>
              <span className="font-mono text-xs font-semibold text-[var(--color-text)] block">${Math.round(resA.totalInterest).toLocaleString()}</span>
            </div>
          </div>

          {/* Loan B */}
          <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 space-y-3">
            <span className="font-extrabold text-sm text-[var(--color-text)] block">Loan Offer B</span>
            <div>
              <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase block">Amount ($)</label>
              <input
                type="number"
                value={loanB.amount}
                onChange={(e) => setLoanB({ ...loanB, amount: e.target.value })}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-xs font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase block">Rate (%)</label>
              <input
                type="number"
                value={loanB.rate}
                onChange={(e) => setLoanB({ ...loanB, rate: e.target.value })}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-xs font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase block">Term (Years)</label>
              <input
                type="number"
                value={loanB.years}
                onChange={(e) => setLoanB({ ...loanB, years: e.target.value })}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-xs font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-[var(--color-line)] space-y-1">
              <span className="text-[10px] text-[var(--color-text-muted)] block">Monthly Payment</span>
              <span className="font-mono text-base font-bold text-[var(--color-accent)] block">${Math.round(resB.monthly).toLocaleString()}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] block">Total Interest</span>
              <span className="font-mono text-xs font-semibold text-[var(--color-text)] block">${Math.round(resB.totalInterest).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-1">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Interest Savings Verdict</span>
          <p className="text-sm font-extrabold text-[var(--color-text)]">
            {interestWinner === 'A' ? 'Offer A saves more in total interest!' : interestWinner === 'B' ? 'Offer B saves more in total interest!' : 'Both loan offers have equal interest!'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
