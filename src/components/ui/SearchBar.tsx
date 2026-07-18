import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ value, onChange, placeholder = 'Search 45+ tools…', autoFocus }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-surface)] px-4 py-3">
      <Search size={18} className="shrink-0 text-[var(--color-text-muted)]" />
      <input
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search tools"
        className="w-full bg-transparent text-[15px] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none"
      />
      {value && (
        <button aria-label="Clear search" onClick={() => onChange('')} className="shrink-0 text-[var(--color-text-muted)]">
          <X size={17} />
        </button>
      )}
    </div>
  );
}
