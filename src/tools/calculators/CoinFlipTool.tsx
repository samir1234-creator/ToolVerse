import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import { Coins, RotateCw } from 'lucide-react';

export default function CoinFlipTool() {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [stats, setStats] = useState({ heads: 0, tails: 0, total: 0 });
  const controls = useAnimation();

  const handleFlip = async () => {
    if (flipping) return;
    setFlipping(true);
    haptics.medium();

    const isHeads = Math.random() < 0.5;
    const finalResult = isHeads ? 'heads' : 'tails';

    const spinRotations = 1080 + (isHeads ? 0 : 180);
    
    await controls.start({
      rotateY: spinRotations,
      scale: [1, 1.4, 0.9, 1],
      transition: { duration: 1.2, ease: 'easeOut' }
    });

    setResult(finalResult);
    setStats(prev => ({
      heads: prev.heads + (isHeads ? 1 : 0),
      tails: prev.tails + (isHeads ? 0 : 1),
      total: prev.total + 1
    }));
    setFlipping(false);
    haptics.heavy();
  };

  const resetStats = () => {
    haptics.medium();
    setResult(null);
    setStats({ heads: 0, tails: 0, total: 0 });
    controls.set({ rotateY: 0 });
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title="Coin Flip"
        subtitle="Flip a coin for quick decision making"
        action={
          <button onClick={resetStats} className="rounded-full p-2 text-[var(--color-text-muted)] active:bg-[var(--color-surface-2)]">
            <RotateCw size={19} />
          </button>
        }
      />
      <div className="space-y-6 px-4 pb-28 pt-5 flex flex-col items-center">
        <div className="relative w-48 h-48 flex items-center justify-center perspective-1000 mt-5">
          <motion.div
            animate={controls}
            className="w-40 h-40 rounded-full cursor-pointer relative preserve-3d"
            style={{ transformStyle: 'preserve-3d' }}
            onClick={handleFlip}
          >
            <div
              className="absolute inset-0 rounded-full flex flex-col items-center justify-center border-4 border-amber-300 backface-hidden"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                boxShadow: '0 8px 30px #d9770640, inset 0 2px 5px rgba(255,255,255,0.4)',
                backfaceVisibility: 'hidden',
              }}
            >
              <Coins size={48} className="text-amber-100" />
              <span className="text-sm font-extrabold text-amber-100 uppercase tracking-widest mt-1">Heads</span>
            </div>

            <div
              className="absolute inset-0 rounded-full flex flex-col items-center justify-center border-4 border-amber-400"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #b45309)',
                boxShadow: '0 8px 30px #b4530940, inset 0 2px 5px rgba(255,255,255,0.4)',
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
              }}
            >
              <Coins size={48} className="text-amber-100" />
              <span className="text-sm font-extrabold text-amber-100 uppercase tracking-widest mt-1">Tails</span>
            </div>
          </motion.div>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleFlip}
          disabled={flipping}
          className="rounded-2xl bg-[var(--color-accent)] px-8 py-3.5 font-semibold text-white shadow-lg shadow-purple-500/20 hover:shadow-xl hover:bg-purple-600 active:scale-95 transition-all disabled:opacity-50"
        >
          {flipping ? 'Flipping...' : 'Flip Coin'}
        </motion.button>

        <div className="w-full grid grid-cols-3 gap-3 mt-4 text-center">
          <div className="rounded-2xl bg-[var(--color-surface)] p-3 border border-[var(--color-line)]">
            <span className="text-xs text-[var(--color-text-muted)] block">Heads</span>
            <span className="font-mono text-xl font-bold text-amber-500 mt-1 block">{stats.heads}</span>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface)] p-3 border border-[var(--color-line)]">
            <span className="text-xs text-[var(--color-text-muted)] block">Tails</span>
            <span className="font-mono text-xl font-bold text-amber-600 mt-1 block">{stats.tails}</span>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface)] p-3 border border-[var(--color-line)]">
            <span className="text-xs text-[var(--color-text-muted)] block">Total</span>
            <span className="font-mono text-xl font-bold text-[var(--color-text)] mt-1 block">{stats.total}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
