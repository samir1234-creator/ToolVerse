import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Users, Calendar } from 'lucide-react';

export default function AgeDifferenceTool() {
  const [date1, setDate1] = useState('1995-06-15');
  const [date2, setDate2] = useState('2000-09-20');

  const diff = useMemo(() => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    let years = Math.abs(d2.getFullYear() - d1.getFullYear());
    let months = Math.abs(d2.getMonth() - d1.getMonth());
    let days = Math.abs(d2.getDate() - d1.getDate());

    return { years, months, days, totalDays: diffDays, totalHours: diffHours };
  }, [date1, date2]);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Age & Date Difference Calculator" subtitle="Compare exact age gaps between two birthdays or dates" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Person 1 Birthday / Date
            </label>
            <input
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-2.5 font-mono text-sm font-semibold text-[var(--color-text)] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Person 2 Birthday / Date
            </label>
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-2.5 font-mono text-sm font-semibold text-[var(--color-text)] focus:outline-none"
            />
          </div>
        </div>

        {diff && (
          <div className="rounded-3xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-6 text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] block">
              Exact Age Difference
            </span>
            <h2 className="text-3xl font-extrabold font-display text-[var(--color-text)]">
              {diff.years} Years, {diff.months} Months, {diff.days} Days
            </h2>
            <div className="pt-2 border-t border-[var(--color-line)] grid grid-cols-2 gap-2 text-xs text-[var(--color-text-muted)]">
              <div>Total Days: <strong className="text-[var(--color-text)] font-mono">{diff.totalDays.toLocaleString()}</strong></div>
              <div>Total Hours: <strong className="text-[var(--color-text)] font-mono">{diff.totalHours.toLocaleString()}</strong></div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
