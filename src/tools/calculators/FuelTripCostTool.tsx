import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Fuel } from 'lucide-react';

export default function FuelTripCostTool() {
  const [distance, setDistance] = useState('350');
  const [efficiency, setEfficiency] = useState('28');
  const [pricePerGallon, setPricePerGallon] = useState('3.65');
  const [passengers, setPassengers] = useState('1');

  const dist = parseFloat(distance) || 0;
  const mpg = parseFloat(efficiency) || 1;
  const gasPrice = parseFloat(pricePerGallon) || 0;
  const numPeople = Math.max(1, parseInt(passengers) || 1);

  const totalFuelNeeded = dist / mpg;
  const totalCost = totalFuelNeeded * gasPrice;
  const costPerPerson = totalCost / numPeople;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Fuel Trip Cost Calculator" subtitle="Estimate trip gas expense & split cost among passengers" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Trip Distance (Miles)
            </label>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-2.5 font-mono text-lg font-bold text-[var(--color-text)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Fuel Economy (MPG)
              </label>
              <input
                type="number"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
                Gas Price ($/gal)
              </label>
              <input
                type="number"
                value={pricePerGallon}
                onChange={(e) => setPricePerGallon(e.target.value)}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1">
              Number of Passengers (Split Cost)
            </label>
            <input
              type="number"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-[var(--color-accent)]/30 bg-[var(--color-accent-soft)] p-6 text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] block">Total Trip Fuel Cost</span>
          <h2 className="text-4xl font-extrabold font-mono text-[var(--color-text)]">${totalCost.toFixed(2)}</h2>
          {numPeople > 1 && (
            <p className="text-xs text-[var(--color-text-muted)]">
              Split per person: <strong className="text-[var(--color-accent)]">${costPerPerson.toFixed(2)}</strong> ({numPeople} passengers)
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
