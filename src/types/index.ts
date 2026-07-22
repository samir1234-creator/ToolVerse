import type { LucideIcon } from 'lucide-react';

export type CategoryId = 'calculators' | 'finance' | 'health' | 'converters' | 'devtools' | 'texttools';

export type FieldType = 'number' | 'select' | 'date' | 'text';

export interface FieldOption {
  label: string;
  value: string;
}

export interface CalculatorField {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  unit?: string;
  defaultValue?: string;
  options?: FieldOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ResultRow {
  label: string;
  value: string;
  emphasis?: boolean;
}

export interface CalculatorDefinition {
  id: string;
  fields: CalculatorField[];
  compute: (values: Record<string, string>) => ResultRow[] | null;
  formula: string;
  example: string;
}

export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: CategoryId;
  subcategory: string;
  route: string;
  popular?: boolean;
}

export interface UnitDefinition {
  id: string;
  label: string;
  toBase: number;
  offset?: number;
}

export interface UnitCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  units: UnitDefinition[];
}

export interface HistoryEntry {
  id: string;
  toolId: string;
  toolName: string;
  summary: string;
  result: string;
  timestamp: number;
}

export type ThemeMode = 'dark' | 'light' | 'system';
