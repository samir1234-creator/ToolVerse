import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { ShoppingBag, Tag, CheckCircle2 } from 'lucide-react';
import { haptics } from '@/utils/haptics';

export default function UnitPriceTool() {
  const [itemA, setItemA] = useState({ price: '12.99', quantity: '500', unit: 'g' });
  const [itemB, setItemB] = useState({ price: '19.99', quantity: '800', unit: 'g' });

  const priceA = parseFloat(itemA.price) || 0;
  const qtyA = parseFloat(itemA.quantity) || 1;
  const unitPriceA = priceA / qtyA;

  const priceB = parseFloat(itemB.price) || 0;
  const qtyB = parseFloat(itemB.quantity) || 1;
  const unitPriceB = priceB / qtyB;

  const winner = unitPriceA < unitPriceB ? 'A' : unitPriceB < unitPriceA ? 'B' : 'equal';
  const savingsPct = unitPriceA && unitPriceB 
    ? Math.abs(((unitPriceA - unitPriceB) / Math.max(unitPriceA, unitPriceB)) * 100).toFixed(1)
    : '0';

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Unit Price Deal Finder" subtitle="Compare grocery items & find the best value deal" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {/* Option A */}
          <div className={`rounded-3xl p-4 border space-y-3 ${winner === 'A' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[var(--color-surface)] border-[var(--color-line)]'}`}>
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-sm text-[var(--color-text)] flex items-center gap-1">
                <ShoppingBag size={15} className="text-[var(--color-accent)]" /> Option A
              </span>
              {winner === 'A' && <CheckCircle2 size={16} className="text-emerald-400" />}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--color-text-muted)] block mb-1">Price ($)</label>
              <input
                type="number"
                value={itemA.price}
                onChange={(e) => setItemA({ ...itemA, price: e.target.value })}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--color-text-muted)] block mb-1">Quantity / Size</label>
              <input
                type="number"
                value={itemA.quantity}
                onChange={(e) => setItemA({ ...itemA, quantity: e.target.value })}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-[var(--color-line)] text-center">
              <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase block">Unit Price</span>
              <span className="font-mono text-base font-extrabold text-[var(--color-accent)]">
                ${unitPriceA.toFixed(4)} / unit
              </span>
            </div>
          </div>

          {/* Option B */}
          <div className={`rounded-3xl p-4 border space-y-3 ${winner === 'B' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-[var(--color-surface)] border-[var(--color-line)]'}`}>
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-sm text-[var(--color-text)] flex items-center gap-1">
                <Tag size={15} className="text-[var(--color-accent)]" /> Option B
              </span>
              {winner === 'B' && <CheckCircle2 size={16} className="text-emerald-400" />}
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--color-text-muted)] block mb-1">Price ($)</label>
              <input
                type="number"
                value={itemB.price}
                onChange={(e) => setItemB({ ...itemB, price: e.target.value })}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--color-text-muted)] block mb-1">Quantity / Size</label>
              <input
                type="number"
                value={itemB.quantity}
                onChange={(e) => setItemB({ ...itemB, quantity: e.target.value })}
                className="w-full rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-3 py-2 text-sm font-mono font-bold text-[var(--color-text)] focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-[var(--color-line)] text-center">
              <span className="text-[10px] font-semibold text-[var(--color-text-muted)] uppercase block">Unit Price</span>
              <span className="font-mono text-base font-extrabold text-[var(--color-accent)]">
                ${unitPriceB.toFixed(4)} / unit
              </span>
            </div>
          </div>
        </div>

        {/* Verdict Banner */}
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center space-y-1">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">Best Value Verdict</span>
          <p className="text-lg font-extrabold text-[var(--color-text)]">
            {winner === 'A' ? 'Option A is the Better Deal!' : winner === 'B' ? 'Option B is the Better Deal!' : 'Both Options Offer Equal Value!'}
          </p>
          {winner !== 'equal' && (
            <p className="text-xs text-[var(--color-text-muted)]">
              Saves approximately <strong className="text-emerald-400">{savingsPct}%</strong> per unit.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
