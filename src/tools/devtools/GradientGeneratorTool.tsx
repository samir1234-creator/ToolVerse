import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { CopyField } from '@/components/tools/CopyField';
import { pageVariants } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import { RefreshCw } from 'lucide-react';

export default function GradientGeneratorTool() {
  const [color1, setColor1] = useState('#8b5cf6');
  const [color2, setColor2] = useState('#ec4899');
  const [angle, setAngle] = useState(135);
  const [type, setType] = useState<'linear' | 'radial'>('linear');

  const gradientString = type === 'linear'
    ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
    : `radial-gradient(circle, ${color1}, ${color2})`;

  const handleRandomize = () => {
    haptics.medium();
    const getRandomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setColor1(getRandomHex());
    setColor2(getRandomHex());
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title="Gradient Generator"
        subtitle="Design and copy custom CSS gradients"
        action={
          <button onClick={handleRandomize} className="rounded-full p-2 text-[var(--color-text-muted)] active:bg-[var(--color-surface-2)]">
            <RefreshCw size={19} />
          </button>
        }
      />
      <div className="space-y-5 px-4 pb-28 pt-5">
        <div
          className="w-full h-40 rounded-3xl border border-[var(--color-line)] relative flex items-end p-4 shadow-inner"
          style={{ background: gradientString }}
        />

        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1">
            {(['linear', 'radial'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { haptics.light(); setType(t); }}
                className={`rounded-xl py-2 text-xs font-semibold capitalize transition-all ${type === t ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-text-muted)]'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">Color 1</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={color1}
                  onChange={(e) => setColor1(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded-lg border border-[var(--color-line)] bg-transparent p-0"
                />
                <input
                  type="text"
                  value={color1.toUpperCase()}
                  onChange={(e) => setColor1(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none uppercase font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">Color 2</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={color2}
                  onChange={(e) => setColor2(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded-lg border border-[var(--color-line)] bg-transparent p-0"
                />
                <input
                  type="text"
                  value={color2.toUpperCase()}
                  onChange={(e) => setColor2(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {type === 'linear' && (
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[var(--color-text-muted)]">Angle</span>
                <span className="font-mono">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-[var(--color-surface-2)] appearance-none cursor-pointer accent-[var(--color-accent)]"
              />
            </div>
          )}
        </div>

        <CopyField label="CSS Output" value={`background: ${gradientString};`} />
      </div>
    </motion.div>
  );
}
