import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CalculatorKey } from '@/components/tools/CalculatorKey';
import { evaluateExpression } from '@/utils/mathEval';
import { slideUp, slideX, keypadContainer, keypadRow } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import { useAppStore } from '@/hooks/useAppStore';

// ─── Organized key layout ───────────────────────────────
const TRIG_KEYS  = ['sin(', 'cos(', 'tan(', 'asin(', 'acos(', 'atan('];
const EXTRA_KEYS = ['log(', 'ln(', 'sqrt(', '^', '!', 'pi'];

// Row layout: C and = sit together at the top of the numpad
const BASIC_KEYS = [
  ['C',  '=',  '⌫', '(', ')'],   // C + = top-left, 5 buttons
  ['7',  '8',  '9',  '÷'],
  ['4',  '5',  '6',  '×'],
  ['1',  '2',  '3',  '−'],
  ['00', '0',  '.',  '+'],
];

function displayKey(k: string) {
  const MAP: Record<string, string> = {
    'sin(':  'sin',  'cos(':  'cos',  'tan(':  'tan',
    'asin(': 'asin', 'acos(': 'acos', 'atan(': 'atan',
    'log(':  'log',  'ln(':   'ln',   'sqrt(': '√',
    '^': 'xʸ', '!': 'n!', 'pi': 'π',
  };
  return MAP[k] ?? k;
}

/** Auto-shrink font so big results never need dots */
function getResultFontSize(text: string): string {
  const len = text.replace(/[,. ]/g, '').length;
  if (len <= 7)  return '3rem';
  if (len <= 10) return '2.2rem';
  if (len <= 14) return '1.65rem';
  if (len <= 18) return '1.25rem';
  return '1rem';
}

function getVariant(key: string): 'default' | 'operator' | 'accent' | 'muted' {
  if (key === '=')  return 'accent';
  if (key === 'C')  return 'muted';
  if (['÷', '×', '−', '+', '(', ')'].includes(key)) return 'operator';
  return 'default';
}

export default function ScientificCalculator() {
  const [expr, setExpr] = useState('');
  const [mode, setMode] = useState<'deg' | 'rad'>('deg');
  const navigate = useNavigate();
  const addHistory = useAppStore((s) => s.addHistory);

  const preview = useMemo(() => {
    if (!expr) return null;
    try { return evaluateExpression(expr, mode); }
    catch { return null; }
  }, [expr, mode]);

  const press = (key: string) => {
    if (key === 'C')  { haptics.medium(); setExpr(''); return; }
    if (key === '⌫') { haptics.light();  setExpr((e) => e.slice(0, -1)); return; }
    if (key === '=')  {
      if (preview !== null) {
        haptics.medium();
        addHistory({ toolId: 'scientific', toolName: 'Scientific Calculator', summary: expr, result: String(preview) });
        setExpr(String(preview));
      }
      return;
    }
    setExpr((e) => e + key);
  };

  return (
    <div className="flex h-full flex-col gradient-mesh overflow-hidden">

      {/* ── Top: Display area ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-1 flex-col min-h-0"
      >
        {/* Mini header */}
        <div className="flex items-center justify-between px-4 pt-[calc(env(safe-area-inset-top)+32px)] pb-3">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => { haptics.light(); navigate(-1); }}
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: 'var(--color-surface-2)' }}
          >
            <ChevronLeft size={20} color="var(--color-text-muted)" />
          </motion.button>
          <span className="font-display text-base font-semibold text-[var(--color-text)]">Scientific</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMode((m) => (m === 'deg' ? 'rad' : 'deg'))}
            className="rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
            style={{
              background: 'linear-gradient(135deg, #8b5cf620, #6366f115)',
              border: '1px solid #8b5cf640',
              color: 'var(--color-accent)',
            }}
          >
            {mode}
          </motion.button>
        </div>

        {/* Expression + result */}
        <div className="flex flex-1 flex-col justify-end px-6 pb-4 text-right overflow-hidden">
          <p className="font-mono text-sm leading-snug text-[var(--color-text-muted)] break-all opacity-70">
            {expr || '0'}
          </p>
          <AnimatePresence mode="popLayout">
            {(() => {
              const formatted = preview !== null
                ? preview.toLocaleString('en-IN', { maximumFractionDigits: 8 })
                : '0';
              return (
                <motion.p
                  key={preview !== null ? String(preview) : '__zero__'}
                  variants={slideX}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="mt-1 font-mono font-bold tabular-nums break-all leading-tight"
                  style={{
                    fontSize: getResultFontSize(formatted),
                    transition: 'font-size 0.2s ease',
                    background: 'linear-gradient(90deg, #f0eeff 30%, #a78bfa 80%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {formatted}
                </motion.p>
              );
            })()}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Bottom: Glass keypad panel ────────────── */}
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        className="rounded-t-[36px] border-t border-[var(--color-line)] px-4 pb-[calc(env(safe-area-inset-bottom)+28px)] pt-4 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #161820f0 0%, #0d0e14f8 100%)',
          boxShadow: '0 -8px 40px #8b5cf618, 0 -1px 0 #8b5cf625',
        }}
      >
        <motion.div
          variants={keypadContainer}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-2"
        >
          {/* Trig row: sin cos tan asin acos atan */}
          <motion.div variants={keypadRow} className="flex gap-1.5">
            {TRIG_KEYS.map((k) => (
              <CalculatorKey key={k} onPress={() => press(k)} variant="operator" shape="circle"
                className="flex-1 aspect-square text-[10px] font-bold">
                {displayKey(k)}
              </CalculatorKey>
            ))}
          </motion.div>

          {/* Extra row: log ln √ xʸ n! π */}
          <motion.div variants={keypadRow} className="flex gap-1.5">
            {EXTRA_KEYS.map((k) => (
              <CalculatorKey key={k} onPress={() => press(k)} variant="operator" shape="circle"
                className="flex-1 aspect-square text-[11px] font-bold">
                {displayKey(k)}
              </CalculatorKey>
            ))}
          </motion.div>

          {/* Basic numpad rows — = is top-left */}
          {BASIC_KEYS.map((row, ri) => (
            <motion.div key={ri} variants={keypadRow} className="flex gap-1.5">
              {row.map((key, ki) => (
                <CalculatorKey
                  key={ri + key + ki}
                  onPress={() => press(key)}
                  shape="circle"
                  variant={getVariant(key)}
                  className="flex-1 aspect-square"
                >
                  {key === '⌫' ? <Delete size={15} /> : key}
                </CalculatorKey>
              ))}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
