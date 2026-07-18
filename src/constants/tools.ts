import {
  Calculator, Sigma, Percent, Tag, Receipt, Landmark, Wallet, TrendingUp,
  PiggyBank, Banknote, Percent as PercentIcon, LineChart, ShoppingBag,
  BadgePercent, Cake, HeartPulse, Flame, Droplets, CalendarRange, Timer,
  Fuel, HandCoins, Users, GraduationCap, ClipboardCheck, Plug,
  Binary, Hash, KeyRound, ShieldCheck, FileDigit, Shuffle, Type as TypeIcon,
  WholeWord, FlipHorizontal, RemoveFormatting, CaseSensitive,
  QrCode, Scan, Barcode, Palette, Volume2, Link2, FileJson, Coins, Dices,
  Smartphone as DeviceIcon, BatteryCharging, Layers, Compass
} from 'lucide-react';
import type { ToolMeta } from '@/types';
import { unitCategories } from './converters';

export const tools: ToolMeta[] = [
  // Calculators
  { id: 'basic', name: 'Basic Calculator', description: 'Everyday arithmetic, fast', icon: Calculator, category: 'calculators', subcategory: 'Calculators', route: '/calculator/basic', popular: true },
  { id: 'scientific', name: 'Scientific Calculator', description: 'Trig, logs & more', icon: Sigma, category: 'calculators', subcategory: 'Calculators', route: '/calculator/scientific', popular: true },
  { id: 'percentage', name: 'Percentage', description: 'Find percentages instantly', icon: Percent, category: 'calculators', subcategory: 'Calculators', route: '/calculator/percentage', popular: true },
  { id: 'discount', name: 'Discount', description: 'Calculate sale prices', icon: Tag, category: 'calculators', subcategory: 'Calculators', route: '/calculator/discount' },
  { id: 'gst', name: 'GST', description: 'Add or remove GST', icon: Receipt, category: 'calculators', subcategory: 'Calculators', route: '/calculator/gst', popular: true },
  { id: 'emi', name: 'EMI', description: 'Monthly loan installments', icon: Landmark, category: 'calculators', subcategory: 'Calculators', route: '/calculator/emi', popular: true },
  { id: 'loan', name: 'Loan', description: 'Full loan repayment plan', icon: Wallet, category: 'calculators', subcategory: 'Calculators', route: '/calculator/loan' },
  { id: 'sip', name: 'SIP', description: 'Mutual fund SIP returns', icon: TrendingUp, category: 'calculators', subcategory: 'Calculators', route: '/calculator/sip' },
  { id: 'fd', name: 'Fixed Deposit', description: 'FD maturity value', icon: PiggyBank, category: 'calculators', subcategory: 'Calculators', route: '/calculator/fd' },
  { id: 'rd', name: 'Recurring Deposit', description: 'RD maturity value', icon: Banknote, category: 'calculators', subcategory: 'Calculators', route: '/calculator/rd' },
  { id: 'simple-interest', name: 'Simple Interest', description: 'Classic SI formula', icon: PercentIcon, category: 'calculators', subcategory: 'Calculators', route: '/calculator/simple-interest' },
  { id: 'compound-interest', name: 'Compound Interest', description: 'Interest on interest', icon: LineChart, category: 'calculators', subcategory: 'Calculators', route: '/calculator/compound-interest' },
  { id: 'profit-loss', name: 'Profit & Loss', description: 'Business profit or loss', icon: ShoppingBag, category: 'calculators', subcategory: 'Calculators', route: '/calculator/profit-loss' },
  { id: 'margin', name: 'Margin', description: 'Margin vs. markup', icon: BadgePercent, category: 'calculators', subcategory: 'Calculators', route: '/calculator/margin' },
  { id: 'age', name: 'Age Calculator', description: 'Your exact age today', icon: Cake, category: 'calculators', subcategory: 'Calculators', route: '/calculator/age', popular: true },
  { id: 'bmi', name: 'BMI', description: 'Body mass index', icon: HeartPulse, category: 'calculators', subcategory: 'Calculators', route: '/calculator/bmi', popular: true },
  { id: 'bmr', name: 'BMR', description: 'Basal metabolic rate', icon: Flame, category: 'calculators', subcategory: 'Calculators', route: '/calculator/bmr' },
  { id: 'calories', name: 'Calories', description: 'Daily calorie needs', icon: Flame, category: 'calculators', subcategory: 'Calculators', route: '/calculator/calories' },
  { id: 'water-intake', name: 'Water Intake', description: 'Daily hydration target', icon: Droplets, category: 'calculators', subcategory: 'Calculators', route: '/calculator/water-intake' },
  { id: 'date-difference', name: 'Date Difference', description: 'Days between two dates', icon: CalendarRange, category: 'calculators', subcategory: 'Calculators', route: '/calculator/date-difference' },
  { id: 'time-calculator', name: 'Time Calculator', description: 'Add or subtract time', icon: Timer, category: 'calculators', subcategory: 'Calculators', route: '/calculator/time-calculator' },
  { id: 'fuel-cost', name: 'Fuel Cost', description: 'Trip fuel expenses', icon: Fuel, category: 'calculators', subcategory: 'Calculators', route: '/calculator/fuel-cost' },
  { id: 'tip', name: 'Tip Calculator', description: 'Split the tip fairly', icon: HandCoins, category: 'calculators', subcategory: 'Calculators', route: '/calculator/tip', popular: true },
  { id: 'split-bill', name: 'Split Bill', description: 'Share a bill with friends', icon: Users, category: 'calculators', subcategory: 'Calculators', route: '/calculator/split-bill' },
  { id: 'cgpa', name: 'CGPA Calculator', description: 'Grade point average', icon: GraduationCap, category: 'calculators', subcategory: 'Calculators', route: '/calculator/cgpa' },
  { id: 'attendance', name: 'Attendance', description: 'Track class attendance %', icon: ClipboardCheck, category: 'calculators', subcategory: 'Calculators', route: '/calculator/attendance' },
  { id: 'electricity-bill', name: 'Electricity Bill', description: 'Estimate your power bill', icon: Plug, category: 'calculators', subcategory: 'Calculators', route: '/calculator/electricity-bill' },
  { id: 'coin-flip', name: 'Coin Flip', description: 'Toss a coin for heads or tails', icon: Coins, category: 'calculators', subcategory: 'Calculators', route: '/calculator/coin-flip' },
  { id: 'dice-roller', name: 'Dice Roller', description: 'Roll virtual dice', icon: Dices, category: 'calculators', subcategory: 'Calculators', route: '/calculator/dice-roller' },
  { id: 'compass', name: 'Compass', description: 'Direction and heading', icon: Compass, category: 'calculators', subcategory: 'Calculators', route: '/calculator/compass' },

  // Converters (one entry per unit category)
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

  // Developer tools
  { id: 'base64', name: 'Base64', description: 'Encode & decode Base64', icon: Binary, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/base64', popular: true },
  { id: 'binary-hex-octal', name: 'Binary / Hex / Octal', description: 'Convert number systems', icon: FileDigit, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/binary-hex-octal' },
  { id: 'ascii', name: 'ASCII Converter', description: 'Text to ASCII & back', icon: Hash, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/ascii' },
  { id: 'uuid', name: 'UUID Generator', description: 'Generate unique IDs', icon: FileDigit, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/uuid' },
  { id: 'password-generator', name: 'Password Generator', description: 'Strong random passwords', icon: KeyRound, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/password-generator', popular: true },
  { id: 'hash-generator', name: 'Hash Generator', description: 'SHA-256 / SHA-1 / MD5-like', icon: ShieldCheck, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/hash-generator' },
  { id: 'roman-numerals', name: 'Roman Numerals', description: 'Number to Roman & back', icon: Hash, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/roman-numerals' },
  { id: 'random-number', name: 'Random Number', description: 'Generate random numbers', icon: Shuffle, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/random-number' },
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Create customizable QR codes', icon: QrCode, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/qr-generator', popular: true },
  { id: 'qr-scanner', name: 'QR Code Scanner', description: 'Scan QR codes using camera or files', icon: Scan, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/qr-scanner' },
  { id: 'barcode-generator', name: 'Barcode Generator', description: 'Create 1D barcodes (Code 39)', icon: Barcode, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/barcode-generator' },
  { id: 'color-picker', name: 'Color Picker', description: 'HEX / RGB / HSL values', icon: Palette, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/color-picker' },
  { id: 'url-encoder', name: 'URL Encoder/Decoder', description: 'Encode & decode URLs safely', icon: Link2, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/url-encoder' },
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Format, validate & clean JSON', icon: FileJson, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/json-formatter' },
  { id: 'device-info', name: 'Device Info', description: 'Screen, browser & hardware details', icon: DeviceIcon, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/device-info' },
  { id: 'battery-info', name: 'Battery Info', description: 'Charge status & battery level', icon: BatteryCharging, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/battery-info' },
  { id: 'gradient-generator', name: 'Gradient Generator', description: 'Design CSS background gradients', icon: Layers, category: 'devtools', subcategory: 'Developer Tools', route: '/devtool/gradient-generator' },

  // Text tools
  { id: 'character-counter', name: 'Character Counter', description: 'Count characters instantly', icon: TypeIcon, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/character-counter' },
  { id: 'word-counter', name: 'Word Counter', description: 'Count words & reading time', icon: WholeWord, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/word-counter', popular: true },
  { id: 'reverse-text', name: 'Reverse Text', description: 'Flip text backwards', icon: FlipHorizontal, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/reverse-text' },
  { id: 'remove-spaces', name: 'Remove Extra Spaces', description: 'Clean up whitespace', icon: RemoveFormatting, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/remove-spaces' },
  { id: 'case-converter', name: 'Case Converter', description: 'UPPER, lower, Title Case', icon: CaseSensitive, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/case-converter' },
  { id: 'morse-code', name: 'Morse Code', description: 'Convert text to Morse code & sound', icon: Volume2, category: 'texttools', subcategory: 'Text Tools', route: '/texttool/morse-code' },
];

export const categoryMeta: Record<string, { label: string; description: string }> = {
  calculators: { label: 'Calculators', description: '30 tools for money, health, time & fun' },
  converters: { label: 'Unit Converter', description: '13 categories, every unit you need' },
  devtools: { label: 'Developer Tools', description: '17 tools to format, scan, pick & generate' },
  texttools: { label: 'Text Tools', description: '6 tools to clean, analyze & convert text' },
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
