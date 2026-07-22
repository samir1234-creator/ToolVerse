import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Banknote } from 'lucide-react';

export default function SalaryToHourlyTool() {
  const [salary, setSalary] = useState('75000');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [weeksPerYear, setWeeksPerYear] = useState('52');

  const annual = parseFloat(salary) || 0;
  const hours = parseFloat(hoursPerWeek) || 40;
  const weeks = parseFloat(weeksPerYear) || 52;

  const totalHours = hours * weeks;
  const hourly = totalHours > 0 ? annual / totalHours : 0;
  const monthly = annual / 12;
  const biweekly = annual / 26;
  const daily = hours > 0 ? hourly * (hours / 5) : 0;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Salary to Hourly Converter" subtitle="Convert annual salary to hourly, daily, monthly pay" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Annual Salary ($)
            </label>
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-3 font-mono text-xl font-bold text-[var(--color-text)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Hours / Week
              </label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Weeks / Year
              </label>
              <input
                type="number"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-4 text-center">
            <span className="text-[11px] font-semibold text-[var(--color-accent)] uppercase tracking-wider block">Hourly Rate</span>
            <span className="font-mono text-3xl font-extrabold text-[var(--color-text)] mt-1 block">${hourly.toFixed(2)}/hr</span>
          </div>

          <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-center">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">Monthly Gross</span>
            <span className="font-mono text-2xl font-bold text-[var(--color-text)] mt-1 block">${Math.round(monthly).toLocaleString()}</span>
          </div>

          <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-center">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">Bi-Weekly Pay</span>
            <span className="font-mono text-xl font-bold text-[var(--color-text)] mt-1 block">${Math.round(biweekly).toLocaleString()}</span>
          </div>

          <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 text-center">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block">Daily Rate</span>
            <span className="font-mono text-xl font-bold text-[var(--color-text)] mt-1 block">${Math.round(daily).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
