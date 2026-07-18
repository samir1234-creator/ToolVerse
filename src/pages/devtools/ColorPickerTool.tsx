import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { Copy, RefreshCw } from 'lucide-react';
import { pageVariants } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import { snackbar } from '@/components/ui/Snackbar';

// Conversion helpers
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 139, g: 92, b: 246 };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export default function ColorPickerTool() {
  const [color, setColor] = useState('#8b5cf6');
  const [rgb, setRgb] = useState({ r: 139, g: 92, b: 246 });
  const [hsl, setHsl] = useState({ h: 258, s: 90, l: 66 });

  useEffect(() => {
    const parsed = hexToRgb(color);
    setRgb(parsed);
    setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b));
  }, [color]);

  const updateRgb = (r: number, g: number, b: number) => {
    const hexVal = rgbToHex(r, g, b);
    setColor(hexVal);
  };

  const handleCopy = (text: string) => {
    haptics.light();
    navigator.clipboard.writeText(text);
    snackbar(`Copied: ${text}`);
  };

  const handleRandomize = () => {
    haptics.medium();
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    setColor(rgbToHex(r, g, b));
  };

  // Generate simple color palettes
  const palettes = [
    { name: 'Monochromatic 1', hex: rgbToHex(Math.max(0, rgb.r - 40), Math.max(0, rgb.g - 40), Math.max(0, rgb.b - 40)) },
    { name: 'Base Color', hex: color },
    { name: 'Monochromatic 2', hex: rgbToHex(Math.min(255, rgb.r + 40), Math.min(255, rgb.g + 40), Math.min(255, rgb.b + 40)) },
    { name: 'Complementary', hex: rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b) },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title="Color Picker"
        subtitle="Inspect & generate color formats"
        action={
          <button onClick={handleRandomize} className="rounded-full p-2 text-[var(--color-text-muted)] active:bg-[var(--color-surface-2)]">
            <RefreshCw size={19} />
          </button>
        }
      />
      <div className="space-y-5 px-4 pb-28 pt-5">
        {/* Visual Preview */}
        <div
          className="w-full h-32 rounded-3xl border border-[var(--color-line)] relative overflow-hidden flex items-end p-4"
          style={{ backgroundColor: color }}
        >
          <div className="bg-black/40 backdrop-blur-md rounded-xl px-3 py-1.5 text-white font-mono text-xs font-semibold">
            {color.toUpperCase()}
          </div>
        </div>

        {/* Sliders */}
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">Color Adjusters</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-8 w-8 cursor-pointer rounded-lg border border-[var(--color-line)] bg-transparent p-0"
            />
          </div>

          <div className="space-y-3">
            {/* Red */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 font-mono">
                <span className="text-[var(--color-danger)]">Red</span>
                <span>{rgb.r}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.r}
                onChange={(e) => updateRgb(parseInt(e.target.value), rgb.g, rgb.b)}
                className="w-full h-1.5 rounded-lg bg-[var(--color-surface-2)] appearance-none cursor-pointer accent-[var(--color-danger)]"
              />
            </div>
            {/* Green */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 font-mono">
                <span className="text-[var(--color-accent)]">Green</span>
                <span>{rgb.g}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.g}
                onChange={(e) => updateRgb(rgb.r, parseInt(e.target.value), rgb.b)}
                className="w-full h-1.5 rounded-lg bg-[var(--color-surface-2)] appearance-none cursor-pointer accent-[var(--color-accent)]"
              />
            </div>
            {/* Blue */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1 font-mono">
                <span className="text-indigo-400">Blue</span>
                <span>{rgb.b}</span>
              </div>
              <input
                type="range"
                min="0"
                max="255"
                value={rgb.b}
                onChange={(e) => updateRgb(rgb.r, rgb.g, parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg bg-[var(--color-surface-2)] appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Code copies */}
        <div className="grid grid-cols-1 gap-2">
          {[
            ['HEX', color.toUpperCase()],
            ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
            ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
          ].map(([label, value]) => (
            <div
              key={label}
              onClick={() => handleCopy(value)}
              className="flex items-center justify-between rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-3.5 cursor-pointer active:bg-[var(--color-surface-2)] transition-colors"
            >
              <div>
                <span className="text-xs font-bold text-[var(--color-text-muted)] block">{label}</span>
                <span className="font-mono text-sm font-semibold text-[var(--color-text)]">{value}</span>
              </div>
              <Copy size={16} className="text-[var(--color-text-muted)]" />
            </div>
          ))}
        </div>

        {/* Palette suggestions */}
        <div>
          <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Suggested Palette
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {palettes.map((p, idx) => (
              <div
                key={idx}
                onClick={() => setColor(p.hex)}
                className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-2 text-center cursor-pointer active:scale-95 transition-all"
              >
                <div className="w-full h-12 rounded-xl mb-1.5" style={{ backgroundColor: p.hex }} />
                <span className="text-[10px] font-semibold text-[var(--color-text-muted)] font-mono">{p.hex.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
