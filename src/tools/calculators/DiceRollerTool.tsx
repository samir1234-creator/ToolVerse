import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { haptics } from '@/utils/haptics';

export default function DiceRollerTool() {
  const [diceCount, setDiceCount] = useState<number>(1);
  const [diceValues, setDiceValues] = useState<number[]>([1]);
  const [rolling, setRolling] = useState(false);
  const controls = useAnimation();

  const handleRoll = async () => {
    if (rolling) return;
    setRolling(true);
    haptics.medium();

    const newValues = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);

    await controls.start({
      rotate: [0, 360, 720],
      scale: [1, 1.25, 0.95, 1],
      transition: { duration: 0.8, ease: 'easeInOut' }
    });

    setDiceValues(newValues);
    setRolling(false);
    haptics.heavy();
  };

  const handleDiceCountChange = (count: number) => {
    haptics.light();
    setDiceCount(count);
    setDiceValues(Array.from({ length: count }, () => 1));
  };

  const sum = diceValues.reduce((a, b) => a + b, 0);

  const renderDiceDots = (val: number) => {
    const dotPositions: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    const activeDots = dotPositions[val] || [];

    return (
      <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-12 h-12 p-1.5 pointer-events-none">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full mx-auto my-auto transition-all ${activeDots.includes(i) ? 'bg-[var(--color-text)]' : 'bg-transparent'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Dice Roller" subtitle="Roll virtual dice for tabletop board games" />
      <div className="space-y-6 px-4 pb-28 pt-5 flex flex-col items-center">
        <div className="w-full flex justify-center gap-1.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] p-1.5">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              onClick={() => handleDiceCountChange(num)}
              className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${diceCount === num ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-text-muted)]'}`}
            >
              {num} {num === 1 ? 'Dice' : 'Dice'}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 justify-center items-center py-6 min-h-[9rem]">
          {diceValues.map((val, idx) => (
            <motion.div
              key={idx}
              animate={controls}
              className="w-20 h-20 rounded-2xl bg-[var(--color-surface)] border-2 border-[var(--color-line)] shadow-lg flex items-center justify-center cursor-pointer active:scale-95 transition-shadow"
              style={{
                boxShadow: '0 8px 24px rgba(0,0,0,0.12), inset 0 2px 4px rgba(255,255,255,0.4)',
              }}
              onClick={handleRoll}
            >
              {renderDiceDots(val)}
            </motion.div>
          ))}
        </div>

        <div className="text-center space-y-3">
          <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Total Sum
          </span>
          <h2 className="text-5xl font-extrabold font-display text-[var(--color-text)] leading-none">
            {sum}
          </h2>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleRoll}
          disabled={rolling}
          className="rounded-2xl bg-[var(--color-accent)] px-8 py-3.5 font-semibold text-white shadow-lg shadow-purple-500/20 hover:shadow-xl w-full max-w-xs"
        >
          {rolling ? 'Rolling...' : 'Roll Dice'}
        </motion.button>
      </div>
    </motion.div>
  );
}
