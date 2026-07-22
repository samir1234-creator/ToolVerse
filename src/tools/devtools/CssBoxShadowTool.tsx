import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { CopyField } from '@/components/tools/CopyField';

export default function CssBoxShadowTool() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(10);
  const [blur, setBlur] = useState(25);
  const [spread, setSpread] = useState(-5);
  const [color, setColor] = useState('#8b5cf6');
  const [opacity, setOpacity] = useState(40);
  const [inset, setInset] = useState(false);

  // Convert hex color to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
  };

  const shadowCss = `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="CSS Box Shadow Generator" subtitle="Design and copy custom CSS box-shadow effects" />
      <div className="space-y-5 px-4 pb-28 pt-4 max-w-md mx-auto">
        {/* Visual Preview Box */}
        <div className="w-full h-44 rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface-2)] flex items-center justify-center p-6">
          <div
            className="w-32 h-24 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] flex items-center justify-center text-xs font-bold text-[var(--color-text)] transition-all"
            style={{ boxShadow: shadowCss }}
          >
            Preview Box
          </div>
        </div>

        {/* Sliders */}
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-3.5 shadow-sm">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[var(--color-text-muted)]">Horizontal Offset (X)</span>
              <span className="font-mono">{x}px</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={x}
              onChange={(e) => setX(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-[var(--color-surface-2)] appearance-none cursor-pointer accent-[var(--color-accent)]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[var(--color-text-muted)]">Vertical Offset (Y)</span>
              <span className="font-mono">{y}px</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={y}
              onChange={(e) => setY(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-[var(--color-surface-2)] appearance-none cursor-pointer accent-[var(--color-accent)]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[var(--color-text-muted)]">Blur Radius</span>
              <span className="font-mono">{blur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={blur}
              onChange={(e) => setBlur(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-[var(--color-surface-2)] appearance-none cursor-pointer accent-[var(--color-accent)]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-[var(--color-text-muted)]">Spread Radius</span>
              <span className="font-mono">{spread}px</span>
            </div>
            <input
              type="range"
              min="-30"
              max="50"
              value={spread}
              onChange={(e) => setSpread(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-[var(--color-surface-2)] appearance-none cursor-pointer accent-[var(--color-accent)]"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-8 cursor-pointer rounded-lg border border-[var(--color-line)] bg-transparent p-0"
              />
              <span className="text-xs font-semibold text-[var(--color-text-muted)]">Shadow Color</span>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
                className="h-4 w-4 accent-[var(--color-accent)] rounded"
              />
              <span className="text-xs font-semibold text-[var(--color-text)]">Inset Shadow</span>
            </label>
          </div>
        </div>

        <CopyField label="CSS Box-Shadow Output" value={`box-shadow: ${shadowCss};`} />
      </div>
    </motion.div>
  );
}
