import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CalculatorKey } from '@/components/tools/CalculatorKey';
import { evaluateExpression } from '@/utils/mathEval';
import { numberToIndianWords } from '@/utils/numberToWords';
import { pageVariants, keypadContainer, keypadRow, slideX } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import { useAppStore } from '@/hooks/useAppStore';

const KEYS: { label: string; key: string }[][] = [
  [
    { label: 'C',  key: 'C'  },
    { label: '⌫', key: '⌫' },
    { label: '%',  key: '%'  },
    { label: '÷',  key: '÷'  },
  ],
  [
    { label: '7', key: '7' },
    { label: '8', key: '8' },
    { label: '9', key: '9' },
    { label: '×', key: '×' },
  ],
  [
    { label: '4', key: '4' },
    { label: '5', key: '5' },
    { label: '6', key: '6' },
    { label: '−', key: '−' },
  ],
  [
    { label: '1', key: '1' },
    { label: '2', key: '2' },
    { label: '3', key: '3' },
    { label: '+', key: '+' },
  ],
  [
    { label: '00', key: '00' },
    { label: '0',  key: '0'  },
    { label: '.',  key: '.'  },
    { label: '=',  key: '='  },
  ],
];

function getVariant(key: string): 'default' | 'operator' | 'accent' | 'muted' {
  if (key === '=') return 'accent';
  if (['÷', '×', '−', '+', '%'].includes(key)) return 'operator';
  if (key === 'C') return 'muted';
  return 'default';
}

/** Auto-shrink font size so long numbers never overflow — no truncation dots */
function getResultFontSize(text: string): string {
  const len = text.replace(/[,. ]/g, '').length; // count real digits
  if (len <= 7)  return '2.6rem';
  if (len <= 10) return '2rem';
  if (len <= 14) return '1.55rem';
  if (len <= 18) return '1.2rem';
  return '0.95rem';
}

export default function BasicCalculator() {
  const [expr, setExpr] = useState('');
  const navigate = useNavigate();
  const addHistory = useAppStore((s) => s.addHistory);

  const preview = useMemo(() => {
    if (!expr || /[+\-×÷%]$/.test(expr)) return null;
    try { return evaluateExpression(expr); }
    catch { return null; }
  }, [expr]);

  const formattedPreview = preview !== null
    ? preview.toLocaleString('en-IN', { maximumFractionDigits: 8 })
    : null;

  // Indian words — only for finite integers within range
  const inWords = useMemo(() => {
    if (preview === null) return null;
    if (!isFinite(preview)) return null;
    if (Math.abs(preview) > 9_999_999_999_999) return null; // too large
    return numberToIndianWords(preview);
  }, [preview]);

  const press = (key: string) => {
    if (key === 'C')  { haptics.medium(); setExpr(''); return; }
    if (key === '⌫') { haptics.light();  setExpr((e) => e.slice(0, -1)); return; }
    if (key === '=') {
      if (preview !== null) {
        haptics.medium();
        addHistory({ toolId: 'basic', toolName: 'Basic Calculator', summary: expr, result: String(preview) });
        setExpr(String(preview));
      }
      return;
    }
    setExpr((e) => e + key);
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full flex-col gradient-mesh overflow-hidden"
    >
      <div className="glass-strong flex items-center justify-between border-b border-[var(--color-line)] px-4 pb-3.5 pt-[calc(env(safe-area-inset-top)+32px)]">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => { haptics.light(); navigate(-1); }}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: 'var(--color-surface-2)' }}
        >
          <ChevronLeft size={20} color="var(--color-text-muted)" />
        </motion.button>
        <h1 className="font-display text-base font-semibold text-[var(--color-text)]">Calculator</h1>
        <div className="w-9" />
      </div>

      {/* ── Display + Words — single fixed box, nothing outside ever changes size ── */}
      <div
        className="calc-display mx-4 mt-3 mb-3 flex flex-col justify-end overflow-hidden rounded-3xl px-5 pt-4 pb-3 text-right"
        style={{ height: '10rem', minHeight: '10rem', maxHeight: '10rem' }}
      >
        {/* Expression */}
        <p className="font-mono text-sm text-[var(--color-text-muted)] opacity-70 break-all leading-snug">
          {expr || '0'}
        </p>

        {/* Result — auto-shrinking */}
        <AnimatePresence mode="popLayout">
          <motion.p
            key={formattedPreview ?? '__empty__'}
            variants={slideX}
            initial="initial"
            animate="animate"
            exit="exit"
            className="font-mono font-bold tabular-nums text-[var(--color-text)] break-all leading-tight mt-1"
            style={{
              fontSize: formattedPreview ? getResultFontSize(formattedPreview) : '2.6rem',
              textShadow: '0 0 28px #8b5cf650',
              transition: 'font-size 0.2s ease',
            }}
          >
            {formattedPreview ?? <span className="opacity-0">0</span>}
          </motion.p>
        </AnimatePresence>

        {/* Indian words — always occupies fixed space at bottom of panel */}
        <div className="h-8 flex items-end justify-end mt-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {inWords && (
              <motion.p
                key={inWords}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="font-body text-[11px] font-medium text-right leading-tight line-clamp-2 break-words"
                style={{ color: '#a78bfa' }}
              >
                {inWords}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Keypad — all circles ──────────────────── */}
      <motion.div
        variants={keypadContainer}
        initial="initial"
        animate="animate"
        className="flex flex-1 flex-col justify-around px-4 pb-[calc(env(safe-area-inset-bottom)+28px)]"
      >
        {KEYS.map((row, ri) => (
          <motion.div key={ri} variants={keypadRow} className="flex justify-around w-full">
            {row.map(({ label, key }) => (
              <CalculatorKey
                key={key}
                onPress={() => press(key)}
                variant={getVariant(key)}
                shape="circle"
                className="w-[22%] aspect-square"
              >
                {key === '⌫' ? <Delete size={18} /> : label}
              </CalculatorKey>
            ))}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
