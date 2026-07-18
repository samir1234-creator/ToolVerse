import type { CalculatorDefinition, ResultRow } from '@/types';
import { toNumber, isValid, formatNumber, formatCurrency, formatPercent } from '@/utils/format';

const num = (id: string, label: string, opts: Partial<CalculatorDefinition['fields'][0]> = {}) => ({
  id,
  label,
  type: 'number' as const,
  ...opts,
});

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export const calculatorDefinitions: Record<string, CalculatorDefinition> = {
  percentage: {
    id: 'percentage',
    fields: [num('value', 'Number', { placeholder: 'e.g. 250' }), num('percent', 'Percentage', { unit: '%', placeholder: 'e.g. 20' })],
    formula: 'Result = (Value × Percentage) / 100',
    example: '20% of 250 = 50',
    compute: (v) => {
      const value = toNumber(v.value);
      const percent = toNumber(v.percent);
      if (!isValid(value, percent)) return null;
      const result = (value * percent) / 100;
      return [
        { label: `${formatNumber(percent)}% of ${formatNumber(value)}`, value: formatNumber(result), emphasis: true },
        { label: `${formatNumber(value)} increased by ${formatNumber(percent)}%`, value: formatNumber(value + result) },
        { label: `${formatNumber(value)} decreased by ${formatNumber(percent)}%`, value: formatNumber(value - result) },
      ];
    },
  },

  discount: {
    id: 'discount',
    fields: [num('price', 'Original Price', { unit: '₹' }), num('discount', 'Discount', { unit: '%' })],
    formula: 'Final Price = Price − (Price × Discount / 100)',
    example: '₹1000 at 30% off → Final ₹700',
    compute: (v) => {
      const price = toNumber(v.price);
      const discount = toNumber(v.discount);
      if (!isValid(price, discount)) return null;
      const amount = (price * discount) / 100;
      return [
        { label: 'You Save', value: formatCurrency(amount) },
        { label: 'Final Price', value: formatCurrency(price - amount), emphasis: true },
      ];
    },
  },

  gst: {
    id: 'gst',
    fields: [
      num('amount', 'Amount', { unit: '₹' }),
      { id: 'rate', label: 'GST Rate', type: 'select', options: [
        { label: '5%', value: '5' }, { label: '12%', value: '12' }, { label: '18%', value: '18' }, { label: '28%', value: '28' },
      ], defaultValue: '18' },
      { id: 'mode', label: 'Type', type: 'select', options: [
        { label: 'Add GST', value: 'add' }, { label: 'Remove GST', value: 'remove' },
      ], defaultValue: 'add' },
    ],
    formula: 'GST Amount = Amount × Rate / 100',
    example: '₹1000 + 18% GST = ₹1180',
    compute: (v) => {
      const amount = toNumber(v.amount);
      const rate = toNumber(v.rate);
      if (!isValid(amount, rate)) return null;
      let base: number, gstAmount: number, total: number;
      if (v.mode === 'remove') {
        base = amount / (1 + rate / 100);
        gstAmount = amount - base;
        total = amount;
      } else {
        base = amount;
        gstAmount = (amount * rate) / 100;
        total = amount + gstAmount;
      }
      return [
        { label: 'Base Amount', value: formatCurrency(base) },
        { label: 'CGST', value: formatCurrency(gstAmount / 2) },
        { label: 'SGST', value: formatCurrency(gstAmount / 2) },
        { label: 'Total GST', value: formatCurrency(gstAmount) },
        { label: 'Total Amount', value: formatCurrency(total), emphasis: true },
      ];
    },
  },

  emi: {
    id: 'emi',
    fields: [
      num('principal', 'Loan Amount', { unit: '₹' }),
      num('rate', 'Interest Rate (p.a.)', { unit: '%' }),
      num('tenure', 'Tenure', { unit: 'months' }),
    ],
    formula: 'EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)',
    example: '₹5L at 9% for 60 months ≈ ₹10,378/mo',
    compute: (v) => {
      const P = toNumber(v.principal);
      const annualRate = toNumber(v.rate);
      const n = toNumber(v.tenure);
      if (!isValid(P, annualRate, n) || n <= 0) return null;
      const r = annualRate / 12 / 100;
      const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      return [
        { label: 'Monthly EMI', value: formatCurrency(emi), emphasis: true },
        { label: 'Total Interest', value: formatCurrency(total - P) },
        { label: 'Total Payment', value: formatCurrency(total) },
      ];
    },
  },

  loan: {
    id: 'loan',
    fields: [
      num('principal', 'Loan Amount', { unit: '₹' }),
      num('rate', 'Interest Rate (p.a.)', { unit: '%' }),
      num('years', 'Tenure', { unit: 'years' }),
    ],
    formula: 'Monthly Payment = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1)',
    example: '₹20L at 8.5% for 20 years ≈ ₹17,357/mo',
    compute: (v) => {
      const P = toNumber(v.principal);
      const annualRate = toNumber(v.rate);
      const years = toNumber(v.years);
      if (!isValid(P, annualRate, years) || years <= 0) return null;
      const r = annualRate / 12 / 100;
      const n = years * 12;
      const emi = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      return [
        { label: 'Monthly Payment', value: formatCurrency(emi), emphasis: true },
        { label: 'Total Interest Payable', value: formatCurrency(total - P) },
        { label: 'Total Repayment', value: formatCurrency(total) },
      ];
    },
  },

  sip: {
    id: 'sip',
    fields: [
      num('monthly', 'Monthly Investment', { unit: '₹' }),
      num('rate', 'Expected Return (p.a.)', { unit: '%' }),
      num('years', 'Duration', { unit: 'years' }),
    ],
    formula: 'FV = P × [((1+i)ⁿ − 1) / i] × (1+i)',
    example: '₹5,000/mo for 10 yrs at 12% ≈ ₹11.6L',
    compute: (v) => {
      const P = toNumber(v.monthly);
      const annualRate = toNumber(v.rate);
      const years = toNumber(v.years);
      if (!isValid(P, annualRate, years) || years <= 0) return null;
      const i = annualRate / 12 / 100;
      const n = years * 12;
      const fv = i === 0 ? P * n : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const invested = P * n;
      return [
        { label: 'Maturity Value', value: formatCurrency(fv), emphasis: true },
        { label: 'Invested Amount', value: formatCurrency(invested) },
        { label: 'Wealth Gained', value: formatCurrency(fv - invested) },
      ];
    },
  },

  fd: {
    id: 'fd',
    fields: [
      num('principal', 'Deposit Amount', { unit: '₹' }),
      num('rate', 'Interest Rate (p.a.)', { unit: '%' }),
      num('years', 'Tenure', { unit: 'years' }),
      { id: 'freq', label: 'Compounding', type: 'select', options: [
        { label: 'Yearly', value: '1' }, { label: 'Half-Yearly', value: '2' }, { label: 'Quarterly', value: '4' }, { label: 'Monthly', value: '12' },
      ], defaultValue: '4' },
    ],
    formula: 'A = P × (1 + r/n)ⁿᵗ',
    example: '₹1L at 7% for 5 yrs (quarterly) ≈ ₹1.41L',
    compute: (v) => {
      const P = toNumber(v.principal);
      const rate = toNumber(v.rate);
      const t = toNumber(v.years);
      const n = toNumber(v.freq);
      if (!isValid(P, rate, t, n)) return null;
      const A = P * Math.pow(1 + rate / 100 / n, n * t);
      return [
        { label: 'Maturity Amount', value: formatCurrency(A), emphasis: true },
        { label: 'Total Interest', value: formatCurrency(A - P) },
      ];
    },
  },

  rd: {
    id: 'rd',
    fields: [
      num('monthly', 'Monthly Deposit', { unit: '₹' }),
      num('rate', 'Interest Rate (p.a.)', { unit: '%' }),
      num('months', 'Tenure', { unit: 'months' }),
    ],
    formula: 'M = R × [(1+i)ⁿ − 1] / (1 − (1+i)^(−1/3)), i = rate/400',
    example: '₹5,000/mo for 24 months at 7% ≈ ₹1.29L',
    compute: (v) => {
      const R = toNumber(v.monthly);
      const rate = toNumber(v.rate);
      const months = toNumber(v.months);
      if (!isValid(R, rate, months) || months <= 0) return null;
      const i = rate / 400;
      const n = months / 3;
      const maturity = i === 0 ? R * months : R * ((Math.pow(1 + i, n) - 1) / (1 - Math.pow(1 + i, -1 / 3)));
      const invested = R * months;
      return [
        { label: 'Maturity Value', value: formatCurrency(maturity), emphasis: true },
        { label: 'Total Deposited', value: formatCurrency(invested) },
        { label: 'Interest Earned', value: formatCurrency(maturity - invested) },
      ];
    },
  },

  'simple-interest': {
    id: 'simple-interest',
    fields: [num('principal', 'Principal', { unit: '₹' }), num('rate', 'Rate (p.a.)', { unit: '%' }), num('time', 'Time', { unit: 'years' })],
    formula: 'SI = (P × R × T) / 100',
    example: '₹10,000 at 8% for 3 yrs = ₹2,400',
    compute: (v) => {
      const P = toNumber(v.principal);
      const R = toNumber(v.rate);
      const T = toNumber(v.time);
      if (!isValid(P, R, T)) return null;
      const si = (P * R * T) / 100;
      return [
        { label: 'Simple Interest', value: formatCurrency(si), emphasis: true },
        { label: 'Total Amount', value: formatCurrency(P + si) },
      ];
    },
  },

  'compound-interest': {
    id: 'compound-interest',
    fields: [
      num('principal', 'Principal', { unit: '₹' }),
      num('rate', 'Rate (p.a.)', { unit: '%' }),
      num('time', 'Time', { unit: 'years' }),
      { id: 'freq', label: 'Compounding', type: 'select', options: [
        { label: 'Annually', value: '1' }, { label: 'Semi-Annually', value: '2' }, { label: 'Quarterly', value: '4' }, { label: 'Monthly', value: '12' },
      ], defaultValue: '1' },
    ],
    formula: 'A = P × (1 + r/n)ⁿᵗ',
    example: '₹10,000 at 8% for 3 yrs (annual) ≈ ₹12,597',
    compute: (v) => {
      const P = toNumber(v.principal);
      const rate = toNumber(v.rate);
      const t = toNumber(v.time);
      const n = toNumber(v.freq);
      if (!isValid(P, rate, t, n)) return null;
      const A = P * Math.pow(1 + rate / 100 / n, n * t);
      return [
        { label: 'Compound Interest', value: formatCurrency(A - P), emphasis: true },
        { label: 'Total Amount', value: formatCurrency(A) },
      ];
    },
  },

  'profit-loss': {
    id: 'profit-loss',
    fields: [num('cost', 'Cost Price', { unit: '₹' }), num('selling', 'Selling Price', { unit: '₹' })],
    formula: 'Profit/Loss % = (SP − CP) / CP × 100',
    example: 'CP ₹500, SP ₹600 → Profit ₹100 (20%)',
    compute: (v) => {
      const cp = toNumber(v.cost);
      const sp = toNumber(v.selling);
      if (!isValid(cp, sp) || cp === 0) return null;
      const diff = sp - cp;
      const pct = (diff / cp) * 100;
      return [
        { label: diff >= 0 ? 'Profit' : 'Loss', value: formatCurrency(Math.abs(diff)), emphasis: true },
        { label: 'Percentage', value: formatPercent(Math.abs(pct)) },
      ];
    },
  },

  margin: {
    id: 'margin',
    fields: [num('cost', 'Cost Price', { unit: '₹' }), num('selling', 'Selling Price', { unit: '₹' })],
    formula: 'Margin % = (SP − CP) / SP × 100',
    example: 'CP ₹80, SP ₹100 → Margin 20%, Markup 25%',
    compute: (v) => {
      const cp = toNumber(v.cost);
      const sp = toNumber(v.selling);
      if (!isValid(cp, sp) || sp === 0 || cp === 0) return null;
      const margin = ((sp - cp) / sp) * 100;
      const markup = ((sp - cp) / cp) * 100;
      return [
        { label: 'Margin', value: formatPercent(margin), emphasis: true },
        { label: 'Markup', value: formatPercent(markup) },
        { label: 'Profit', value: formatCurrency(sp - cp) },
      ];
    },
  },

  age: {
    id: 'age',
    fields: [{ id: 'dob', label: 'Date of Birth', type: 'date' }],
    formula: 'Age = Today − Date of Birth',
    example: 'Born 14 Aug 2000 → 25 yrs, X mo, Y days',
    compute: (v) => {
      if (!v.dob) return null;
      const dob = new Date(v.dob);
      const today = new Date();
      if (Number.isNaN(dob.getTime()) || dob > today) return null;
      let years = today.getFullYear() - dob.getFullYear();
      let months = today.getMonth() - dob.getMonth();
      let days = today.getDate() - dob.getDate();
      if (days < 0) {
        months -= 1;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }
      const totalDays = daysBetween(dob, today);
      return [
        { label: 'Your Age', value: `${years}y ${months}m ${days}d`, emphasis: true },
        { label: 'Total Days Lived', value: formatNumber(totalDays, 0) },
        { label: 'Total Weeks', value: formatNumber(totalDays / 7, 0) },
      ];
    },
  },

  bmi: {
    id: 'bmi',
    fields: [num('weight', 'Weight', { unit: 'kg' }), num('height', 'Height', { unit: 'cm' })],
    formula: 'BMI = Weight(kg) / Height(m)²',
    example: '70kg, 175cm → BMI 22.9 (Normal)',
    compute: (v) => {
      const weight = toNumber(v.weight);
      const height = toNumber(v.height);
      if (!isValid(weight, height) || height <= 0) return null;
      const meters = height / 100;
      const bmi = weight / (meters * meters);
      let category = 'Normal';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi >= 25 && bmi < 30) category = 'Overweight';
      else if (bmi >= 30) category = 'Obese';
      return [
        { label: 'Your BMI', value: formatNumber(bmi, 1), emphasis: true },
        { label: 'Category', value: category },
      ];
    },
  },

  bmr: {
    id: 'bmr',
    fields: [
      num('weight', 'Weight', { unit: 'kg' }),
      num('height', 'Height', { unit: 'cm' }),
      num('age', 'Age', { unit: 'years' }),
      { id: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }], defaultValue: 'male' },
    ],
    formula: 'Mifflin-St Jeor Equation',
    example: '70kg, 175cm, 25yo male → BMR ≈ 1,673 kcal',
    compute: (v) => {
      const weight = toNumber(v.weight);
      const height = toNumber(v.height);
      const age = toNumber(v.age);
      if (!isValid(weight, height, age)) return null;
      const base = 10 * weight + 6.25 * height - 5 * age;
      const bmr = v.gender === 'female' ? base - 161 : base + 5;
      return [
        { label: 'Basal Metabolic Rate', value: `${formatNumber(bmr, 0)} kcal/day`, emphasis: true },
        { label: 'Resting (sedentary)', value: `${formatNumber(bmr * 1.2, 0)} kcal/day` },
      ];
    },
  },

  calories: {
    id: 'calories',
    fields: [
      num('weight', 'Weight', { unit: 'kg' }),
      num('height', 'Height', { unit: 'cm' }),
      num('age', 'Age', { unit: 'years' }),
      { id: 'gender', label: 'Gender', type: 'select', options: [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }], defaultValue: 'male' },
      { id: 'activity', label: 'Activity Level', type: 'select', options: [
        { label: 'Sedentary', value: '1.2' }, { label: 'Light', value: '1.375' }, { label: 'Moderate', value: '1.55' }, { label: 'Active', value: '1.725' }, { label: 'Very Active', value: '1.9' },
      ], defaultValue: '1.55' },
    ],
    formula: 'TDEE = BMR × Activity Multiplier',
    example: 'Moderate activity → TDEE ≈ BMR × 1.55',
    compute: (v) => {
      const weight = toNumber(v.weight);
      const height = toNumber(v.height);
      const age = toNumber(v.age);
      const activity = toNumber(v.activity);
      if (!isValid(weight, height, age, activity)) return null;
      const base = 10 * weight + 6.25 * height - 5 * age;
      const bmr = v.gender === 'female' ? base - 161 : base + 5;
      const tdee = bmr * activity;
      return [
        { label: 'Maintenance Calories', value: `${formatNumber(tdee, 0)} kcal`, emphasis: true },
        { label: 'Weight Loss (~0.5kg/wk)', value: `${formatNumber(tdee - 500, 0)} kcal` },
        { label: 'Weight Gain (~0.5kg/wk)', value: `${formatNumber(tdee + 500, 0)} kcal` },
      ];
    },
  },

  'water-intake': {
    id: 'water-intake',
    fields: [
      num('weight', 'Weight', { unit: 'kg' }),
      { id: 'activity', label: 'Activity Level', type: 'select', options: [
        { label: 'Sedentary', value: '0' }, { label: 'Moderate', value: '350' }, { label: 'Active', value: '700' },
      ], defaultValue: '0' },
    ],
    formula: 'Water (ml) = Weight × 33 + Activity Bonus',
    example: '70kg, moderate activity ≈ 2.7 L/day',
    compute: (v) => {
      const weight = toNumber(v.weight);
      const bonus = toNumber(v.activity);
      if (!isValid(weight, bonus)) return null;
      const ml = weight * 33 + bonus;
      return [
        { label: 'Daily Water Intake', value: `${formatNumber(ml / 1000, 1)} L`, emphasis: true },
        { label: 'In Glasses (250ml)', value: `${formatNumber(ml / 250, 0)} glasses` },
      ];
    },
  },

  'date-difference': {
    id: 'date-difference',
    fields: [{ id: 'start', label: 'Start Date', type: 'date' }, { id: 'end', label: 'End Date', type: 'date' }],
    formula: 'Difference = End Date − Start Date',
    example: '1 Jan 2026 → 17 Jul 2026 = 197 days',
    compute: (v) => {
      if (!v.start || !v.end) return null;
      const start = new Date(v.start);
      const end = new Date(v.end);
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
      const days = Math.abs(daysBetween(start, end));
      return [
        { label: 'Total Days', value: formatNumber(days, 0), emphasis: true },
        { label: 'Weeks', value: formatNumber(days / 7, 1) },
        { label: 'Months (approx)', value: formatNumber(days / 30.44, 1) },
        { label: 'Years (approx)', value: formatNumber(days / 365.25, 2) },
      ];
    },
  },

  'time-calculator': {
    id: 'time-calculator',
    fields: [
      num('h1', 'Hours', {}), num('m1', 'Minutes', {}), num('s1', 'Seconds', {}),
      { id: 'op', label: 'Operation', type: 'select', options: [{ label: 'Add', value: 'add' }, { label: 'Subtract', value: 'sub' }], defaultValue: 'add' },
      num('h2', 'Hours', {}), num('m2', 'Minutes', {}), num('s2', 'Seconds', {}),
    ],
    formula: 'Convert both durations to seconds, then add or subtract',
    example: '1h 30m + 45m = 2h 15m 0s',
    compute: (v) => {
      const t1 = toNumber(v.h1 || '0') * 3600 + toNumber(v.m1 || '0') * 60 + toNumber(v.s1 || '0');
      const t2 = toNumber(v.h2 || '0') * 3600 + toNumber(v.m2 || '0') * 60 + toNumber(v.s2 || '0');
      if (!isValid(t1, t2)) return null;
      let total = v.op === 'sub' ? t1 - t2 : t1 + t2;
      const neg = total < 0;
      total = Math.abs(total);
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = Math.floor(total % 60);
      return [{ label: 'Result', value: `${neg ? '-' : ''}${h}h ${m}m ${s}s`, emphasis: true }];
    },
  },

  'fuel-cost': {
    id: 'fuel-cost',
    fields: [num('distance', 'Distance', { unit: 'km' }), num('mileage', 'Mileage', { unit: 'km/l' }), num('price', 'Fuel Price', { unit: '₹/l' })],
    formula: 'Cost = (Distance / Mileage) × Price',
    example: '500km at 15km/l, ₹100/l → ₹3,333',
    compute: (v) => {
      const distance = toNumber(v.distance);
      const mileage = toNumber(v.mileage);
      const price = toNumber(v.price);
      if (!isValid(distance, mileage, price) || mileage <= 0) return null;
      const litres = distance / mileage;
      return [
        { label: 'Fuel Required', value: `${formatNumber(litres, 2)} L` },
        { label: 'Total Cost', value: formatCurrency(litres * price), emphasis: true },
      ];
    },
  },

  tip: {
    id: 'tip',
    fields: [num('bill', 'Bill Amount', { unit: '₹' }), num('tip', 'Tip', { unit: '%', defaultValue: '10' }), num('people', 'Number of People', { defaultValue: '1' })],
    formula: 'Tip = Bill × Tip% ; Per Person = (Bill + Tip) / People',
    example: '₹1000 bill, 10% tip, 2 people → ₹550 each',
    compute: (v) => {
      const bill = toNumber(v.bill);
      const tipPct = toNumber(v.tip);
      const people = toNumber(v.people) || 1;
      if (!isValid(bill, tipPct, people) || people <= 0) return null;
      const tipAmount = (bill * tipPct) / 100;
      const total = bill + tipAmount;
      return [
        { label: 'Tip Amount', value: formatCurrency(tipAmount) },
        { label: 'Total Bill', value: formatCurrency(total) },
        { label: 'Per Person', value: formatCurrency(total / people), emphasis: true },
      ];
    },
  },

  'split-bill': {
    id: 'split-bill',
    fields: [num('total', 'Total Amount', { unit: '₹' }), num('people', 'Number of People', { defaultValue: '2' }), num('tip', 'Tip', { unit: '%', defaultValue: '0' })],
    formula: 'Per Person = (Total + Tip) / People',
    example: '₹2000 total, 4 people, 5% tip → ₹525 each',
    compute: (v) => {
      const total = toNumber(v.total);
      const people = toNumber(v.people);
      const tipPct = toNumber(v.tip);
      if (!isValid(total, people, tipPct) || people <= 0) return null;
      const withTip = total + (total * tipPct) / 100;
      return [
        { label: 'Total with Tip', value: formatCurrency(withTip) },
        { label: 'Each Person Pays', value: formatCurrency(withTip / people), emphasis: true },
      ];
    },
  },

  cgpa: {
    id: 'cgpa',
    fields: [num('points', 'Total Grade Points'), num('credits', 'Total Credits')],
    formula: 'CGPA = Total Grade Points / Total Credits',
    example: 'CGPA 8.2 ≈ 77.9% (India formula: CGPA × 9.5)',
    compute: (v) => {
      const points = toNumber(v.points);
      const credits = toNumber(v.credits);
      if (!isValid(points, credits) || credits <= 0) return null;
      const cgpa = points / credits;
      return [
        { label: 'CGPA', value: formatNumber(cgpa, 2), emphasis: true },
        { label: 'Approx. Percentage', value: formatPercent(cgpa * 9.5) },
      ];
    },
  },

  attendance: {
    id: 'attendance',
    fields: [num('total', 'Total Classes'), num('attended', 'Classes Attended'), num('target', 'Target %', { defaultValue: '75' })],
    formula: 'Attendance % = Attended / Total × 100',
    example: '80 of 100 classes → 80% attendance',
    compute: (v) => {
      const total = toNumber(v.total);
      const attended = toNumber(v.attended);
      const target = toNumber(v.target);
      if (!isValid(total, attended, target) || total <= 0) return null;
      const pct = (attended / total) * 100;
      const rows: ResultRow[] = [{ label: 'Current Attendance', value: formatPercent(pct), emphasis: true }];
      if (pct >= target) {
        const canMiss = Math.floor((attended - (target / 100) * total) / (target / 100));
        rows.push({ label: `Classes You Can Miss (stay at ${formatNumber(target,0)}%)`, value: `${Math.max(canMiss, 0)}` });
      } else {
        const needed = Math.ceil((target / 100 * total - attended) / (1 - target / 100));
        rows.push({ label: `Classes Needed for ${formatNumber(target,0)}%`, value: `${Math.max(needed, 0)}` });
      }
      return rows;
    },
  },

  'electricity-bill': {
    id: 'electricity-bill',
    fields: [num('units', 'Units Consumed', { unit: 'kWh' }), num('rate', 'Rate per Unit', { unit: '₹' }), num('fixed', 'Fixed Charge', { unit: '₹', defaultValue: '0' })],
    formula: 'Bill = (Units × Rate) + Fixed Charge',
    example: '250 units at ₹7/unit + ₹50 fixed = ₹1,800',
    compute: (v) => {
      const units = toNumber(v.units);
      const rate = toNumber(v.rate);
      const fixed = toNumber(v.fixed || '0');
      if (!isValid(units, rate, fixed)) return null;
      return [{ label: 'Estimated Bill', value: formatCurrency(units * rate + fixed), emphasis: true }];
    },
  },
};
