import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { Download, Barcode } from 'lucide-react';
import { pageVariants } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import { snackbar } from '@/components/ui/Snackbar';

// Code 39 mapping (9 elements per char: 5 bars, 4 spaces. 1 = narrow, 2 = wide)
// b = bar, s = space
const CODE39_ENCODINGS: Record<string, string> = {
  '0': 'b1s1b1s2b2s1b2s1b1', '1': 'b2s1b1s2b1s1b1s1b2', '2': 'b1s1b2s2b1s1b1s1b2', '3': 'b2s1b2s2b1s1b1s1b1',
  '4': 'b1s1b1s2b2s1b1s1b2', '5': 'b2s1b1s2b2s1b1s1b1', '6': 'b1s1b2s2b2s1b1s1b1', '7': 'b1s1b1s2b1s1b2s1b2',
  '8': 'b2s1b1s2b1s1b2s1b1', '9': 'b1s1b2s2b1s1b2s1b1', 'A': 'b2s1b1s1b1s2b1s1b2', 'B': 'b1s1b2s1b1s2b1s1b2',
  'C': 'b2s1b2s1b1s2b1s1b1', 'D': 'b1s1b1s1b2s2b1s1b2', 'E': 'b2s1b1s1b2s2b1s1b1', 'F': 'b1s1b2s1b2s2b1s1b1',
  'G': 'b1s1b1s1b1s2b2s1b2', 'H': 'b2s1b1s1b1s2b2s1b1', 'I': 'b1s1b2s1b1s2b2s1b1', 'J': 'b1s1b1s1b2s2b2s1b1',
  'K': 'b2s1b1s1b1s1b1s2b2', 'L': 'b1s1b2s1b1s1b1s2b2', 'M': 'b2s1b2s1b1s1b1s2b1', 'N': 'b1s1b1s1b2s1b1s2b2',
  'O': 'b2s1b1s1b2s1b1s2b1', 'P': 'b1s1b2s1b2s1b1s2b1', 'Q': 'b1s1b1s1b1s1b2s2b2', 'R': 'b2s1b1s1b1s1b2s2b1',
  'S': 'b1s1b2s1b1s1b2s2b1', 'T': 'b1s1b1s1b2s1b2s2b1', 'U': 'b2s2b1s1b1s1b1s1b2', 'V': 'b1s2b2s1b1s1b1s1b2',
  'W': 'b2s2b2s1b1s1b1s1b1', 'X': 'b1s2b1s1b2s1b1s1b2', 'Y': 'b2s2b1s1b2s1b1s1b1', 'Z': 'b1s2b2s1b2s1b1s1b1',
  '-': 'b1s2b1s1b1s1b2s1b2', '.': 'b2s2b1s1b1s1b2s1b1', ' ': 'b1s2b2s1b1s1b2s1b1', '*': 'b1s2b1s1b2s1b2s1b1',
  '$': 'b1s2b1s2b1s2b1s1b1', '/': 'b1s2b1s2b1s1b2s2b1', '+': 'b1s2b1s1b2s2b1s2b1', '%': 'b1s1b2s2b1s2b1s2b1'
};

export default function BarcodeGeneratorTool() {
  const [text, setText] = useState('TOOLVERSE');
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setError('');
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Validate Code 39 input
    const cleaned = text.toUpperCase();
    const invalidChars = cleaned.split('').filter(char => !CODE39_ENCODINGS[char]);
    if (invalidChars.length > 0) {
      setError(`Invalid characters: ${invalidChars.join(', ')}`);
      return;
    }

    if (!cleaned) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    // Wrap with start/stop characters
    const fullText = `*${cleaned}*`;
    
    // Draw config
    const narrowWidth = 2;
    const wideWidth = 5;
    const height = 80;
    const margin = 20;

    // Calculate total width
    let totalWidth = 0;
    for (let char of fullText) {
      const pattern = CODE39_ENCODINGS[char];
      const elements = pattern.match(/[bs]\d/g) || [];
      elements.forEach((el) => {
        const type = el[0];
        const multiplier = parseInt(el[1]);
        const width = multiplier === 1 ? narrowWidth : wideWidth;
        totalWidth += width;
      });
      totalWidth += narrowWidth; // gap between characters
    }

    canvas.width = totalWidth + margin * 2;
    canvas.height = height + 40; // extra space for text at the bottom

    // Clear background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw bars
    let currentX = margin;
    ctx.fillStyle = '#000000';

    for (let char of fullText) {
      const pattern = CODE39_ENCODINGS[char];
      const elements = pattern.match(/[bs]\d/g) || [];
      elements.forEach((el) => {
        const isBar = el[0] === 'b';
        const multiplier = parseInt(el[1]);
        const width = multiplier === 1 ? narrowWidth : wideWidth;

        if (isBar) {
          ctx.fillRect(currentX, 15, width, height);
        }
        currentX += width;
      });
      currentX += narrowWidth; // inter-char gap (white space)
    }

    // Draw text label
    ctx.fillStyle = '#000000';
    ctx.font = '14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(cleaned, canvas.width / 2, height + 30);
  }, [text]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || error) return;
    haptics.medium();

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `barcode-${text.toLowerCase() || 'code'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    snackbar('Barcode downloaded!');
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Barcode Generator" subtitle="Generate Code 39 standard 1D barcodes" />
      <div className="space-y-5 px-4 pb-28 pt-5">
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
              Barcode Text (Alphanumeric A-Z, 0-9, space, - . $ / + % *)
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. TOOLVERSE"
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none uppercase"
            />
            {error && <p className="text-xs font-semibold text-[var(--color-danger)] mt-2">{error}</p>}
          </div>
        </div>

        {!error && text && (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-[var(--color-surface)] p-6 border border-[var(--color-line)]">
            <div className="overflow-x-auto w-full flex justify-center py-4 bg-white rounded-2xl">
              <canvas ref={canvasRef} className="max-w-full" />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              className="mt-5 flex items-center gap-2 rounded-2xl bg-[var(--color-accent)] px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 hover:shadow-xl"
            >
              <Download size={18} />
              Download Barcode
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
