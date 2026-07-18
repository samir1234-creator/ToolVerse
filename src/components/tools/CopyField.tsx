import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { haptics } from '@/utils/haptics';

interface CopyFieldProps {
  label: string;
  value: string;
  mono?: boolean;
}

export function CopyField({ label, value, mono = true }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!value) return;
    haptics.light();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // clipboard unavailable, no-op
    }
  };

  return (
    <div className="rounded-2xl bg-[var(--color-surface-2)] p-4">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-medium text-[var(--color-text-muted)]">{label}</span>
        <button onClick={copy} aria-label={`Copy ${label}`} className="rounded-full p-1.5 text-[var(--color-text-muted)] active:bg-[var(--color-surface)]">
          {copied ? <Check size={15} className="text-[var(--color-success)]" /> : <Copy size={15} />}
        </button>
      </div>
      <p className={`break-all text-[15px] text-[var(--color-text)] ${mono ? 'font-mono' : ''}`}>{value || '—'}</p>
    </div>
  );
}
