import type { CalculatorField } from '@/types';

interface FieldProps {
  field: CalculatorField;
  value: string;
  onChange: (v: string) => void;
}

export function CalculatorFieldInput({ field, value, onChange }: FieldProps) {
  if (field.type === 'select') {
    return (
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-muted)]">{field.label}</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-[15px] text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
        >
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === 'date') {
    return (
      <label className="block">
        <span className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-muted)]">{field.label}</span>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-3 text-[15px] text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
        />
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[var(--color-text-muted)]">{field.label}</span>
      <div className="flex items-center rounded-xl border border-[var(--color-line)] bg-[var(--color-surface)] px-4 focus-within:border-[var(--color-accent)]">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          placeholder={field.placeholder ?? '0'}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-3 text-[15px] font-mono text-[var(--color-text)] focus:outline-none"
        />
        {field.unit && <span className="ml-2 shrink-0 text-sm text-[var(--color-text-muted)]">{field.unit}</span>}
      </div>
    </label>
  );
}
