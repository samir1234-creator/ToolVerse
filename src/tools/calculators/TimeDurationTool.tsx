import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Timer, Clock } from 'lucide-react';

export default function TimeDurationTool() {
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:30');
  const [breakMins, setBreakMins] = useState('30');

  const [h1, m1] = startTime.split(':').map((n) => parseInt(n) || 0);
  const [h2, m2] = endTime.split(':').map((n) => parseInt(n) || 0);
  const brk = parseInt(breakMins) || 0;

  let totalStart = h1 * 60 + m1;
  let totalEnd = h2 * 60 + m2;
  if (totalEnd < totalStart) totalEnd += 24 * 60; // Next day wrap

  const diffMins = Math.max(0, totalEnd - totalStart - brk);
  const durHours = Math.floor(diffMins / 60);
  const durMins = diffMins % 60;
  const decimalHours = (diffMins / 60).toFixed(2);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Work Shift & Time Duration" subtitle="Calculate hours & minutes between shift start & end times" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2.5 font-mono text-sm font-semibold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2.5 font-mono text-sm font-semibold text-[var(--color-text)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">Unpaid Break (Minutes)</label>
            <input
              type="number"
              value={breakMins}
              onChange={(e) => setBreakMins(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-6 text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] block">Total Work Duration</span>
          <h2 className="text-4xl font-extrabold font-mono text-[var(--color-text)]">
            {durHours}h {durMins}m
          </h2>
          <p className="text-xs text-[var(--color-text-muted)]">
            Decimal Payroll Hours: <strong className="text-[var(--color-text)] font-mono">{decimalHours} hrs</strong>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
