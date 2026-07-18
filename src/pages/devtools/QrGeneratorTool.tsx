import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { Download, QrCode } from 'lucide-react';
import { pageVariants } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import { snackbar } from '@/components/ui/Snackbar';

export default function QrGeneratorTool() {
  const [text, setText] = useState('https://toolverse.app');
  const [size, setSize] = useState('200');
  const [fgColor, setFgColor] = useState('#8b5cf6');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [generating, setGenerating] = useState(false);

  const qrUrl = text
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${fgColor.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}`
    : '';

  const handleDownload = async () => {
    if (!qrUrl) return;
    haptics.medium();
    setGenerating(true);
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      snackbar('QR Code downloaded!');
    } catch {
      snackbar('Failed to download QR code');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="QR Code Generator" subtitle="Generate customizable QR codes" />
      <div className="space-y-5 px-4 pb-28 pt-5">
        <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
              Text or URL
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text or link here..."
              className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
                Size
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none"
              >
                <option value="150">150x150</option>
                <option value="200">200x200</option>
                <option value="250">250x250</option>
                <option value="300">300x300</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
                Foreground
              </label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-full h-10 rounded-xl border border-[var(--color-line)] bg-transparent p-1 cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider block mb-2">
                Background
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-10 rounded-xl border border-[var(--color-line)] bg-transparent p-1 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {text && (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-[var(--color-surface)] p-6 border border-[var(--color-line)]">
            <div className="rounded-2xl bg-white p-4 shadow-inner" style={{ minHeight: `${size}px` }}>
              <img
                src={qrUrl}
                alt="QR Code"
                className="mx-auto rounded-lg"
                style={{ width: `${size}px`, height: `${size}px` }}
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDownload}
              disabled={generating}
              className="mt-5 flex items-center gap-2 rounded-2xl bg-[var(--color-accent)] px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 hover:shadow-xl disabled:opacity-50"
            >
              <Download size={18} />
              {generating ? 'Downloading...' : 'Download QR Code'}
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
