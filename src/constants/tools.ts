import {
  Calculator, Sigma, Percent, Tag, Receipt, Landmark, Wallet, TrendingUp,
  PiggyBank, Banknote, Percent as PercentIcon, LineChart, ShoppingBag,
  BadgePercent, Cake, HeartPulse, Flame, Droplets, CalendarRange, Timer,
  Fuel, HandCoins, Users, GraduationCap, ClipboardCheck, Plug,
  Binary, Hash, KeyRound, ShieldCheck, FileDigit, Shuffle, Type as TypeIcon,
  WholeWord, FlipHorizontal, RemoveFormatting, CaseSensitive,
  QrCode, Scan, Barcode, Palette, Volume2, Link2, FileJson, Coins, Dices,
  Smartphone as DeviceIcon, BatteryCharging, Layers, Compass, DollarSign, Scale,
  Clock, Code, FileText, Edit3, Box, Minimize2, Sparkles, AlignLeft
} from 'lucide-react';
import type { ToolMeta } from '@/types';
import { unitCategories } from './converters';

export const tools: ToolMeta[] = [
  // 1. Math & Core Calculators (15 tools)
  { id: 'basic', name: 'Basic Calculator', description: 'Everyday arithmetic, fast', icon: Calculator, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/basic', popular: true },
  { id: 'scientific', name: 'Scientific Calculator', description: 'Trig, logs & advanced formulas', icon: Sigma, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/scientific', popular: true },
  { id: 'percentage', name: 'Percentage', description: 'Find percentages instantly', icon: Percent, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/percentage' },
  { id: 'percentage-change', name: 'Percentage Change', description: 'Percentage increase, decrease & inflation', icon: Percent, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/percentage-change' },
  { id: 'discount', name: 'Discount', description: 'Calculate sale prices & savings', icon: Tag, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/discount' },
  { id: 'simple-interest', name: 'Simple Interest', description: 'Classic SI formula', icon: PercentIcon, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/simple-interest' },
  { id: 'compound-interest', name: 'Compound Interest', description: 'Interest on interest growth', icon: LineChart, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/compound-interest' },
  { id: 'stopwatch', name: 'Stopwatch & Timer', description: 'Millisecond stopwatch with lap tracking', icon: Timer, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/stopwatch', popular: true },
  { id: 'date-difference', name: 'Date Difference', description: 'Days between two dates', icon: CalendarRange, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/date-difference' },
  { id: 'time-calculator', name: 'Time Calculator', description: 'Add or subtract hours & minutes', icon: Timer, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/time-calculator' },
  { id: 'cgpa', name: 'CGPA Calculator', description: 'Grade point average', icon: GraduationCap, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/cgpa' },
  { id: 'attendance', name: 'Attendance', description: 'Track class attendance %', icon: ClipboardCheck, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/attendance' },
  { id: 'coin-flip', name: 'Coin Flip', description: 'Toss a coin for heads or tails', icon: Coins, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/coin-flip' },
  { id: 'dice-roller', name: 'Dice Roller', description: 'Roll virtual dice', icon: Dices, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/dice-roller' },
  { id: 'compass', name: 'Compass', description: 'Direction and heading sensor', icon: Compass, category: 'calculators', subcategory: 'Math Calculators', route: '/calculator/compass' },

  // 2. Finance & Money Tools (17 tools)
  { id: 'currency', name: 'Currency Converter', description: 'Real-time world exchange rates', icon: DollarSign, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/currency', popular: true },
  { id: 'crypto', name: 'Crypto Price Tracker', description: 'Bitcoin, Ethereum & crypto USD values', icon: Coins, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/crypto', popular: true },
  { id: 'gst', name: 'GST', description: 'Add or remove GST', icon: Receipt, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/gst', popular: true },
  { id: 'sales-tax', name: 'Sales Tax & VAT', description: 'Add or remove sales tax instantly', icon: Receipt, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/sales-tax' },
  { id: 'emi', name: 'EMI Calculator', description: 'Monthly loan installments', icon: Landmark, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/emi', popular: true },
  { id: 'loan', name: 'Loan Calculator', description: 'Full loan repayment plan', icon: Wallet, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/loan' },
  { id: 'loan-payoff', name: 'Early Loan Payoff', description: 'Calculate extra payment interest savings', icon: Landmark, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/loan-payoff' },
  { id: 'loan-comparison', name: 'Loan Offer Comparison', description: 'Compare 2 loan offers side-by-side', icon: Scale, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/loan-comparison' },
  { id: 'rule-of-72', name: 'Rule of 72', description: 'Investment doubling time estimator', icon: TrendingUp, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/rule-of-72' },
  { id: 'sip', name: 'SIP Calculator', description: 'Mutual fund SIP returns', icon: TrendingUp, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/sip' },
  { id: 'fd', name: 'Fixed Deposit', description: 'FD maturity value', icon: PiggyBank, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/fd' },
  { id: 'rd', name: 'Recurring Deposit', description: 'RD maturity value', icon: Banknote, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/rd' },
  { id: 'salary-hourly', name: 'Salary to Hourly', description: 'Annual salary to hourly & monthly pay', icon: Banknote, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/salary-hourly' },
  { id: 'profit-loss', name: 'Profit & Loss', description: 'Business profit or loss', icon: ShoppingBag, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/profit-loss' },
  { id: 'margin', name: 'Margin Calculator', description: 'Margin vs. markup', icon: BadgePercent, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/margin' },
  { id: 'tip', name: 'Tip Calculator', description: 'Split the tip fairly', icon: HandCoins, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/tip' },
  { id: 'split-bill', name: 'Split Bill', description: 'Share a bill with friends', icon: Users, category: 'finance', subcategory: 'Finance & Money', route: '/calculator/split-bill' },

  // 3. Health & Daily Life (10 tools)
  { id: 'unit-price', name: 'Unit Price Deal Finder', description: 'Compare grocery deals & item values', icon: ShoppingBag, category: 'health', subcategory: 'Health & Life', route: '/calculator/unit-price' },
  { id: 'fuel-trip-cost', name: 'Fuel Trip Cost', description: 'Estimate trip gas expenses & split cost', icon: Fuel, category: 'health', subcategory: 'Health & Life', route: '/calculator/fuel-trip-cost' },
  { id: 'electricity-bill', name: 'Electricity Bill', description: 'Estimate your power bill', icon: Plug, category: 'health', subcategory: 'Health & Life', route: '/calculator/electricity-bill' },
  { id: 'age', name: 'Age Calculator', description: 'Your exact age today', icon: Cake, category: 'health', subcategory: 'Health & Life', route: '/calculator/age' },
  { id: 'age-difference', name: 'Age & Date Gap', description: 'Compare age gaps between 2 dates', icon: CalendarRange, category: 'health', subcategory: 'Health & Life', route: '/calculator/age-difference' },
  { id: 'body-fat', name: 'Body Fat % Calculator', description: 'US Navy body composition metric', icon: HeartPulse, category: 'health', subcategory: 'Health & Life', route: '/calculator/body-fat' },
  { id: 'bmi', name: 'BMI Calculator', description: 'Body mass index', icon: HeartPulse, category: 'health', subcategory: 'Health & Life', route: '/calculator/bmi' },
  { id: 'bmr', name: 'BMR Calculator', description: 'Basal metabolic rate', icon: Flame, category: 'health', subcategory: 'Health & Life', route: '/calculator/bmr' },
  { id: 'calories', name: 'Calorie Needs', description: 'Daily calorie targets', icon: Flame, category: 'health', subcategory: 'Health & Life', route: '/calculator/calories' },
  { id: 'water-intake', name: 'Water Hydration', description: 'Daily hydration target', icon: Droplets, category: 'health', subcategory: 'Health & Life', route: '/calculator/water-intake' },
  { id: 'time-duration', name: 'Work Shift & Duration', description: 'Calculate work shift hours & minutes', icon: Clock, category: 'health', subcategory: 'Health & Life', route: '/calculator/time-duration' },

  // 4. Converters (one entry per unit category - 13 tools)
  ...unitCategories.map((c) => ({
    id: `unit-${c.id}`,
    name: `${c.label} Converter`,
    description: `Convert ${c.label.toLowerCase()} units`,
    icon: c.icon,
    category: 'converters' as const,
    subcategory: 'Unit Converter',
    route: `/converter/${c.id}`,
    popular: c.id === 'length' || c.id === 'temperature' || c.id === 'data',
  })),

  // 5. Developer tools (25 tools max)
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode JSON Web Tokens & claims', icon: KeyRound, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/jwt-decoder', popular: true },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Test & debug regular expressions', icon: Code, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/regex-tester', popular: true },
  { id: 'markdown-preview', name: 'Markdown Previewer', description: 'Real-time Markdown editor & viewer', icon: FileText, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/markdown-preview' },
  { id: 'diff-checker', name: 'Diff Checker', description: 'Compare code & text line differences', icon: Edit3, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/diff-checker' },
  { id: 'html-entity', name: 'HTML Entity Encoder', description: 'Encode & decode HTML entities', icon: Code, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/html-entity' },
  { id: 'box-shadow', name: 'CSS Box Shadow', description: 'Visual box shadow code generator', icon: Box, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/box-shadow' },
  { id: 'px-to-rem', name: 'PX to REM / EM', description: 'Convert CSS layout pixels to REM', icon: Minimize2, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/px-to-rem' },
  { id: 'aspect-ratio', name: 'Aspect Ratio Calculator', description: '16:9, 4:3 image & video dimension calculator', icon: Layers, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/aspect-ratio' },
  { id: 'base64', name: 'Base64', description: 'Encode & decode Base64', icon: Binary, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/base64' },
  { id: 'binary-hex-octal', name: 'Binary / Hex / Octal', description: 'Convert number systems', icon: FileDigit, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/binary-hex-octal' },
  { id: 'ascii', name: 'ASCII Converter', description: 'Text to ASCII & back', icon: Hash, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/ascii' },
  { id: 'uuid', name: 'UUID Generator', description: 'Generate unique IDs', icon: FileDigit, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/uuid' },
  { id: 'password-generator', name: 'Password Generator', description: 'Strong random passwords', icon: KeyRound, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/password-generator' },
  { id: 'hash-generator', name: 'Hash Generator', description: 'SHA-256 / SHA-1 / MD5-like', icon: ShieldCheck, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/hash-generator' },
  { id: 'roman-numerals', name: 'Roman Numerals', description: 'Number to Roman & back', icon: Hash, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/roman-numerals' },
  { id: 'random-number', name: 'Random Number', description: 'Generate random numbers', icon: Shuffle, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/random-number' },
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Create customizable QR codes', icon: QrCode, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/qr-generator' },
  { id: 'qr-scanner', name: 'QR Code Scanner', description: 'Scan QR codes using camera or files', icon: Scan, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/qr-scanner' },
  { id: 'barcode-generator', name: 'Barcode Generator', description: 'Create 1D barcodes (Code 39)', icon: Barcode, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/barcode-generator' },
  { id: 'color-picker', name: 'Color Picker', description: 'HEX / RGB / HSL values', icon: Palette, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/color-picker' },
  { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Encode & decode URLs safely', icon: Link2, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/url-encoder' },
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Format, validate & clean JSON', icon: FileJson, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/json-formatter' },
  { id: 'device-info', name: 'Device Info', description: 'Screen, browser & hardware details', icon: DeviceIcon, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/device-info' },
  { id: 'battery-info', name: 'Battery Info', description: 'Charge status & battery level', icon: BatteryCharging, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/battery-info' },
  { id: 'gradient-generator', name: 'Gradient Generator', description: 'Design CSS background gradients', icon: Layers, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/gradient-generator' },

  // 6. Text tools (8 tools)
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Customizable placeholder text', icon: Sparkles, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/lorem-ipsum', popular: true },
  { id: 'text-cleaner', name: 'Text Cleaner & Sorter', description: 'Deduplicate, sort & strip HTML', icon: AlignLeft, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/text-cleaner', popular: true },
  { id: 'character-counter', name: 'Character Counter', description: 'Count characters instantly', icon: TypeIcon, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/character-counter' },
  { id: 'word-counter', name: 'Word Counter', description: 'Count words & reading time', icon: WholeWord, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/word-counter' },
  { id: 'reverse-text', name: 'Reverse Text', description: 'Flip text backwards', icon: FlipHorizontal, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/reverse-text' },
  { id: 'remove-spaces', name: 'Remove Extra Spaces', description: 'Clean up whitespace', icon: RemoveFormatting, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/remove-spaces' },
  { id: 'case-converter', name: 'Case Converter', description: 'UPPER, lower, Title Case', icon: CaseSensitive, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/case-converter' },
  { id: 'morse-code', name: 'Morse Code', description: 'Convert text to Morse code & sound', icon: Volume2, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/morse-code' },
];

export const categoryMeta: Record<string, { label: string; description: string }> = {
  calculators: { label: 'Math Calculators', description: '15 core math, trig, time & odds tools' },
  finance: { label: 'Finance & Money', description: '17 currency, loan, tax & interest tools' },
  health: { label: 'Health & Life', description: '11 fitness, body fat, hydration & age tools' },
  converters: { label: 'Unit Converter', description: '13 unit categories for length, weight, speed' },
  devtools: { label: 'Developer Tools', description: '25 format, scan, inspect & CSS tools' },
  texttools: { label: 'Text Tools', description: '8 text cleaning, editing & analysis tools' },
};

export function getToolById(id: string): ToolMeta | undefined {
  return tools.find((t) => t.id === id);
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return tools.filter(
    (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.subcategory.toLowerCase().includes(q)
  );
}
