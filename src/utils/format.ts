export function toNumber(v: string | undefined): number {
  if (v === undefined || v === '') return NaN;
  const n = Number(v);
  return n;
}

export function isValid(...nums: number[]): boolean {
  return nums.every((n) => !Number.isNaN(n) && Number.isFinite(n));
}

export function formatNumber(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Math.round((n + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;
  return rounded.toLocaleString('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  });
}

export function formatCurrency(n: number, symbol = '₹'): string {
  if (!Number.isFinite(n)) return '—';
  return `${symbol}${formatNumber(n, 2)}`;
}

export function formatPercent(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return '—';
  return `${formatNumber(n, decimals)}%`;
}

export function pad(n: number, len = 2): string {
  return n.toString().padStart(len, '0');
}
