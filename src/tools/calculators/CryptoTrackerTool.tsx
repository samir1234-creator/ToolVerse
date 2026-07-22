import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Coins, TrendingUp, TrendingDown } from 'lucide-react';
import { haptics } from '@/utils/haptics';

const CRYPTO_DATA = [
  { id: 'btc', symbol: 'BTC', name: 'Bitcoin', priceUsd: 67450.0, change24h: 3.42, iconColor: 'text-amber-500' },
  { id: 'eth', symbol: 'ETH', name: 'Ethereum', priceUsd: 3520.5, change24h: 1.85, iconColor: 'text-indigo-400' },
  { id: 'sol', symbol: 'SOL', name: 'Solana', priceUsd: 148.2, change24h: -2.15, iconColor: 'text-purple-400' },
  { id: 'bnb', symbol: 'BNB', name: 'BNB', priceUsd: 580.4, change24h: 0.92, iconColor: 'text-yellow-400' },
  { id: 'xrp', symbol: 'XRP', name: 'XRP', priceUsd: 0.58, change24h: 4.12, iconColor: 'text-blue-400' },
  { id: 'doge', symbol: 'DOGE', name: 'Dogecoin', priceUsd: 0.125, change24h: -1.05, iconColor: 'text-amber-300' },
];

export default function CryptoTrackerTool() {
  const [selectedCrypto, setSelectedCrypto] = useState('btc');
  const [amount, setAmount] = useState('1');

  const activeObj = CRYPTO_DATA.find((c) => c.id === selectedCrypto) || CRYPTO_DATA[0];
  const parsedAmt = parseFloat(amount) || 0;
  const totalUsd = parsedAmt * activeObj.priceUsd;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Crypto Tracker & Calculator" subtitle="Track top crypto prices & instant USD values" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        {/* Crypto List */}
        <div className="grid grid-cols-2 gap-2.5">
          {CRYPTO_DATA.map((c) => {
            const isSelected = c.id === selectedCrypto;
            const isPos = c.change24h >= 0;
            return (
              <div
                key={c.id}
                onClick={() => {
                  haptics.light();
                  setSelectedCrypto(c.id);
                }}
                className={`rounded-2xl p-3.5 border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[var(--color-surface)] border-[var(--color-accent)] shadow-md'
                    : 'bg-[var(--color-surface-2)] border-[var(--color-line)] hover:border-[var(--color-accent)]/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-extrabold text-sm ${c.iconColor}`}>{c.symbol}</span>
                  <span className={`text-[11px] font-bold flex items-center gap-0.5 ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {isPos ? '+' : ''}{c.change24h}%
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-[var(--color-text-muted)] block">{c.name}</span>
                  <span className="font-mono text-sm font-bold text-[var(--color-text)]">
                    ${c.priceUsd.toLocaleString('en-US')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Converter Box */}
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-[var(--color-line)] pb-3">
            <Coins size={18} className="text-[var(--color-accent)]" />
            <h3 className="font-display text-sm font-semibold text-[var(--color-text)]">
              Convert {activeObj.name} ({activeObj.symbol})
            </h3>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-1.5">
              Quantity of {activeObj.symbol}
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-line)] px-4 py-3 font-mono text-xl font-bold text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
            />
          </div>

          <div className="rounded-2xl bg-[var(--color-accent-soft)] p-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)] block mb-1">
              Equivalent USD Value
            </span>
            <span className="font-mono text-3xl font-extrabold text-[var(--color-text)]">
              ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
