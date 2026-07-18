import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { Scan, Upload, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { pageVariants } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import { snackbar } from '@/components/ui/Snackbar';

export default function QrScannerTool() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    haptics.light();
    setPreview(URL.createObjectURL(file));
    setScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://api.qrserver.com/v1/read-qr-code/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      const qrText = data[0]?.symbol[0]?.data;
      const error = data[0]?.symbol[0]?.error;

      if (qrText) {
        haptics.heavy();
        setResult(qrText);
      } else {
        haptics.medium();
        setResult(`Error: ${error || 'No QR Code found in this image.'}`);
      }
    } catch {
      haptics.medium();
      setResult('Failed to scan image. Please try a clearer picture.');
    } finally {
      setScanning(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    haptics.light();
    navigator.clipboard.writeText(result);
    snackbar('Copied to clipboard!');
  };

  const handleReset = () => {
    haptics.light();
    setResult(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isLink = result && /^https?:\/\//.test(result);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="QR Code Scanner" subtitle="Scan QR codes using camera or file upload" />
      <div className="space-y-5 px-4 pb-28 pt-5">
        <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 text-center space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="qr-file-input"
          />

          {!preview ? (
            <label
              htmlFor="qr-file-input"
              className="flex flex-col items-center justify-center border-2 border-dashed border-[var(--color-line)] rounded-2xl p-10 cursor-pointer hover:border-[var(--color-accent)] transition-all bg-[var(--color-surface-2)]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] mb-4">
                <Scan size={32} />
              </div>
              <p className="text-sm font-semibold text-[var(--color-text)]">Choose QR Code image</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Supports camera capture & upload</p>
            </label>
          ) : (
            <div className="relative mx-auto max-w-xs rounded-2xl overflow-hidden border border-[var(--color-line)]">
              <img src={preview} alt="QR Preview" className="w-full h-auto object-cover max-h-64" />
              {scanning && (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="text-[var(--color-accent)] mb-2"
                  >
                    <RefreshCw size={32} />
                  </motion.div>
                  <p className="text-xs font-semibold text-white">Analyzing image...</p>
                </div>
              )}
            </div>
          )}

          {preview && !scanning && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 mx-auto rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-2 text-xs font-semibold text-[var(--color-text-muted)] active:bg-[var(--color-line)]"
            >
              <RefreshCw size={12} />
              Scan Another Image
            </button>
          )}
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Decoded Result
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="rounded-lg p-2 bg-[var(--color-surface-2)] text-[var(--color-text-muted)] active:bg-[var(--color-line)]"
                >
                  <Copy size={16} />
                </button>
                {isLink && (
                  <a
                    href={result}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 bg-[var(--color-surface-2)] text-[var(--color-accent)] active:bg-[var(--color-line)]"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            <p className="font-mono text-sm break-all text-[var(--color-text)] bg-[var(--color-surface-2)] p-4 rounded-xl border border-[var(--color-line)]">
              {result}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
