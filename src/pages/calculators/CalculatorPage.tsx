import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, RotateCcw, History as HistoryIcon } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { CalculatorFieldInput } from '@/components/ui/CalculatorFieldInput';
import { ResultCard } from '@/components/ui/ResultCard';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { EmptyState } from '@/components/ui/EmptyState';
import { calculatorDefinitions } from '@/constants/calculators';
import { getToolById } from '@/constants/tools';
import { useAppStore } from '@/hooks/useAppStore';
import { pageVariants } from '@/animations/variants';
import { haptics } from '@/utils/haptics';

export default function CalculatorPage() {
  const { id = '' } = useParams();
  const definition = calculatorDefinitions[id];
  const tool = getToolById(id);
  const addHistory = useAppStore((s) => s.addHistory);
  const fullHistory = useAppStore((s) => s.history);
  const history = useMemo(() => fullHistory.filter((h) => h.toolId === id), [fullHistory, id]);
  const clearHistory = useAppStore((s) => s.clearHistory);

  const [values, setValues] = useState<Record<string, string>>({});
  const [showFormula, setShowFormula] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (!definition) return;
    const initial: Record<string, string> = {};
    definition.fields.forEach((f) => {
      initial[f.id] = f.defaultValue ?? (f.type === 'select' ? f.options?.[0]?.value ?? '' : '');
    });
    setValues(initial);
  }, [id]);

  const rows = useMemo(() => {
    if (!definition) return null;
    try {
      return definition.compute(values);
    } catch {
      return null;
    }
  }, [definition, values]);

  useEffect(() => {
    if (rows && rows.length && tool) {
      const t = setTimeout(() => {
        addHistory({ toolId: id, toolName: tool.name, summary: 'Calculation', result: rows[0].value });
      }, 900);
      return () => clearTimeout(t);
    }
  }, [rows, id, tool]);

  if (!definition || !tool) {
    return (
      <div>
        <PageHeader title="Not found" />
        <EmptyState icon={RotateCcw} title="Calculator not found" description="This tool may have moved." />
      </div>
    );
  }

  const reset = () => {
    haptics.medium();
    const initial: Record<string, string> = {};
    definition.fields.forEach((f) => {
      initial[f.id] = f.defaultValue ?? (f.type === 'select' ? f.options?.[0]?.value ?? '' : '');
    });
    setValues(initial);
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader
        title={tool.name}
        subtitle={tool.description}
        action={
          <div className="flex gap-1">
            <button onClick={() => setShowHistory(true)} aria-label="History" className="rounded-full p-2 text-[var(--color-text-muted)] active:bg-[var(--color-surface-2)]">
              <HistoryIcon size={19} />
            </button>
            <button onClick={reset} aria-label="Clear" className="rounded-full p-2 text-[var(--color-text-muted)] active:bg-[var(--color-surface-2)]">
              <RotateCcw size={19} />
            </button>
          </div>
        }
      />

      <div className="space-y-5 px-4 pb-28 pt-5">
        <div className="space-y-4 rounded-3xl bg-[var(--color-surface)]/0 p-0">
          {definition.fields.map((field) => (
            <CalculatorFieldInput
              key={field.id}
              field={field}
              value={values[field.id] ?? ''}
              onChange={(v) => setValues((prev) => ({ ...prev, [field.id]: v }))}
            />
          ))}
        </div>

        <ResultCard rows={rows} toolName={tool.name} />

        <div className="rounded-3xl bg-[var(--color-surface)] p-4">
          <button
            onClick={() => setShowFormula((s) => !s)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="font-display text-[15px] font-medium text-[var(--color-text)]">Formula & Example</span>
            <motion.span animate={{ rotate: showFormula ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={18} className="text-[var(--color-text-muted)]" />
            </motion.span>
          </button>
          {showFormula && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2 border-t border-[var(--color-line)] pt-3 text-sm">
                <p className="font-mono text-[var(--color-accent)]">{definition.formula}</p>
                <p className="text-[var(--color-text-muted)]">{definition.example}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <BottomSheet open={showHistory} onClose={() => setShowHistory(false)} title="Recent Calculations">
        {history.length === 0 ? (
          <p className="pb-4 text-sm text-[var(--color-text-muted)]">No history yet for this tool.</p>
        ) : (
          <div className="max-h-72 space-y-2 overflow-y-auto pb-2">
            {history.map((h) => (
              <div key={h.id} className="flex items-center justify-between rounded-xl bg-[var(--color-surface-2)] px-4 py-2.5">
                <span className="text-xs text-[var(--color-text-muted)]">{new Date(h.timestamp).toLocaleString()}</span>
                <span className="font-mono text-sm font-medium text-[var(--color-text)]">{h.result}</span>
              </div>
            ))}
            <button onClick={clearHistory} className="mt-2 w-full rounded-xl py-2.5 text-center text-sm font-medium text-[var(--color-danger)]">
              Clear History
            </button>
          </div>
        )}
      </BottomSheet>
    </motion.div>
  );
}
