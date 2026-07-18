/**
 * Converts a number to Indian number system words.
 * Supports: Crore, Lakh, Thousand, Hundred
 * Range: handles up to 9999 Crore (≈ 100 billion)
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
  'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function belowTwenty(n: number): string {
  return ONES[n] ?? '';
}

function belowHundred(n: number): string {
  if (n < 20) return belowTwenty(n);
  const t = TENS[Math.floor(n / 10)];
  const o = n % 10 !== 0 ? ' ' + belowTwenty(n % 10) : '';
  return t + o;
}

function belowThousand(n: number): string {
  if (n === 0) return '';
  if (n < 100) return belowHundred(n);
  const h = ONES[Math.floor(n / 100)] + ' Hundred';
  const rem = n % 100;
  return h + (rem !== 0 ? ' ' + belowHundred(rem) : '');
}

export function numberToIndianWords(input: number): string {
  if (!isFinite(input)) return '';

  const negative = input < 0;
  let n = Math.abs(Math.floor(input)); // work with integer part

  if (n === 0) return 'Zero';

  const parts: string[] = [];

  // Crores (10,000,000)
  const crore = Math.floor(n / 10_000_000);
  n %= 10_000_000;
  if (crore > 0) parts.push(belowThousand(crore) + ' Crore');

  // Lakhs (100,000)
  const lakh = Math.floor(n / 100_000);
  n %= 100_000;
  if (lakh > 0) parts.push(belowHundred(lakh) + ' Lakh');

  // Thousands (1,000)
  const thousand = Math.floor(n / 1_000);
  n %= 1_000;
  if (thousand > 0) parts.push(belowHundred(thousand) + ' Thousand');

  // Remainder (< 1000)
  if (n > 0) parts.push(belowThousand(n));

  const result = parts.join(' ');
  return negative ? 'Minus ' + result : result;
}
