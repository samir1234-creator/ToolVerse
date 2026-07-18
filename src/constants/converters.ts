import {
  Ruler, Weight, Square, Beaker, Thermometer, Gauge, CircleGauge,
  Zap, Battery, HardDrive, Clock, Compass, Radio,
} from 'lucide-react';
import type { UnitCategory } from '@/types';

export const unitCategories: UnitCategory[] = [
  {
    id: 'length', label: 'Length', icon: Ruler,
    units: [
      { id: 'mm', label: 'Millimeter', toBase: 0.001 },
      { id: 'cm', label: 'Centimeter', toBase: 0.01 },
      { id: 'm', label: 'Meter', toBase: 1 },
      { id: 'km', label: 'Kilometer', toBase: 1000 },
      { id: 'in', label: 'Inch', toBase: 0.0254 },
      { id: 'ft', label: 'Foot', toBase: 0.3048 },
      { id: 'yd', label: 'Yard', toBase: 0.9144 },
      { id: 'mi', label: 'Mile', toBase: 1609.344 },
    ],
  },
  {
    id: 'weight', label: 'Weight', icon: Weight,
    units: [
      { id: 'mg', label: 'Milligram', toBase: 0.000001 },
      { id: 'g', label: 'Gram', toBase: 0.001 },
      { id: 'kg', label: 'Kilogram', toBase: 1 },
      { id: 'tonne', label: 'Tonne', toBase: 1000 },
      { id: 'oz', label: 'Ounce', toBase: 0.0283495 },
      { id: 'lb', label: 'Pound', toBase: 0.453592 },
    ],
  },
  {
    id: 'area', label: 'Area', icon: Square,
    units: [
      { id: 'sqm', label: 'Sq. Meter', toBase: 1 },
      { id: 'sqkm', label: 'Sq. Kilometer', toBase: 1000000 },
      { id: 'sqft', label: 'Sq. Foot', toBase: 0.092903 },
      { id: 'sqyd', label: 'Sq. Yard', toBase: 0.836127 },
      { id: 'acre', label: 'Acre', toBase: 4046.86 },
      { id: 'hectare', label: 'Hectare', toBase: 10000 },
    ],
  },
  {
    id: 'volume', label: 'Volume', icon: Beaker,
    units: [
      { id: 'ml', label: 'Milliliter', toBase: 0.001 },
      { id: 'l', label: 'Liter', toBase: 1 },
      { id: 'gal', label: 'Gallon (US)', toBase: 3.78541 },
      { id: 'qt', label: 'Quart', toBase: 0.946353 },
      { id: 'pt', label: 'Pint', toBase: 0.473176 },
      { id: 'cup', label: 'Cup', toBase: 0.24 },
      { id: 'floz', label: 'Fluid Ounce', toBase: 0.0295735 },
      { id: 'm3', label: 'Cubic Meter', toBase: 1000 },
    ],
  },
  {
    id: 'temperature', label: 'Temperature', icon: Thermometer,
    units: [
      { id: 'c', label: 'Celsius', toBase: 1 },
      { id: 'f', label: 'Fahrenheit', toBase: 1 },
      { id: 'k', label: 'Kelvin', toBase: 1 },
    ],
  },
  {
    id: 'speed', label: 'Speed', icon: Gauge,
    units: [
      { id: 'mps', label: 'Meters/sec', toBase: 1 },
      { id: 'kmph', label: 'Km/hour', toBase: 0.277778 },
      { id: 'mph', label: 'Miles/hour', toBase: 0.44704 },
      { id: 'knot', label: 'Knot', toBase: 0.514444 },
    ],
  },
  {
    id: 'pressure', label: 'Pressure', icon: CircleGauge,
    units: [
      { id: 'pa', label: 'Pascal', toBase: 1 },
      { id: 'kpa', label: 'Kilopascal', toBase: 1000 },
      { id: 'bar', label: 'Bar', toBase: 100000 },
      { id: 'atm', label: 'Atmosphere', toBase: 101325 },
      { id: 'psi', label: 'PSI', toBase: 6894.76 },
    ],
  },
  {
    id: 'energy', label: 'Energy', icon: Zap,
    units: [
      { id: 'j', label: 'Joule', toBase: 1 },
      { id: 'kj', label: 'Kilojoule', toBase: 1000 },
      { id: 'cal', label: 'Calorie', toBase: 4.184 },
      { id: 'kcal', label: 'Kilocalorie', toBase: 4184 },
      { id: 'wh', label: 'Watt-hour', toBase: 3600 },
      { id: 'kwh', label: 'Kilowatt-hour', toBase: 3600000 },
    ],
  },
  {
    id: 'power', label: 'Power', icon: Battery,
    units: [
      { id: 'w', label: 'Watt', toBase: 1 },
      { id: 'kw', label: 'Kilowatt', toBase: 1000 },
      { id: 'hp', label: 'Horsepower', toBase: 745.7 },
      { id: 'mw', label: 'Megawatt', toBase: 1000000 },
    ],
  },
  {
    id: 'data', label: 'Data Storage', icon: HardDrive,
    units: [
      { id: 'bit', label: 'Bit', toBase: 0.125 },
      { id: 'byte', label: 'Byte', toBase: 1 },
      { id: 'kb', label: 'Kilobyte', toBase: 1024 },
      { id: 'mb', label: 'Megabyte', toBase: 1024 ** 2 },
      { id: 'gb', label: 'Gigabyte', toBase: 1024 ** 3 },
      { id: 'tb', label: 'Terabyte', toBase: 1024 ** 4 },
    ],
  },
  {
    id: 'time', label: 'Time', icon: Clock,
    units: [
      { id: 'sec', label: 'Second', toBase: 1 },
      { id: 'min', label: 'Minute', toBase: 60 },
      { id: 'hour', label: 'Hour', toBase: 3600 },
      { id: 'day', label: 'Day', toBase: 86400 },
      { id: 'week', label: 'Week', toBase: 604800 },
      { id: 'month', label: 'Month (30d)', toBase: 2592000 },
      { id: 'year', label: 'Year (365d)', toBase: 31536000 },
    ],
  },
  {
    id: 'angle', label: 'Angle', icon: Compass,
    units: [
      { id: 'deg', label: 'Degree', toBase: 1 },
      { id: 'rad', label: 'Radian', toBase: 57.29578 },
      { id: 'grad', label: 'Gradian', toBase: 0.9 },
    ],
  },
  {
    id: 'frequency', label: 'Frequency', icon: Radio,
    units: [
      { id: 'hz', label: 'Hertz', toBase: 1 },
      { id: 'khz', label: 'Kilohertz', toBase: 1000 },
      { id: 'mhz', label: 'Megahertz', toBase: 1000000 },
      { id: 'ghz', label: 'Gigahertz', toBase: 1000000000 },
    ],
  },
];

function toCelsius(value: number, from: string): number {
  if (from === 'c') return value;
  if (from === 'f') return ((value - 32) * 5) / 9;
  return value - 273.15; // kelvin
}

function fromCelsius(celsius: number, to: string): number {
  if (to === 'c') return celsius;
  if (to === 'f') return (celsius * 9) / 5 + 32;
  return celsius + 273.15; // kelvin
}

export function convertValue(categoryId: string, value: number, fromId: string, toId: string): number {
  if (categoryId === 'temperature') {
    return fromCelsius(toCelsius(value, fromId), toId);
  }
  const category = unitCategories.find((c) => c.id === categoryId);
  if (!category) return NaN;
  const from = category.units.find((u) => u.id === fromId);
  const to = category.units.find((u) => u.id === toId);
  if (!from || !to) return NaN;
  const base = value * from.toBase;
  return base / to.toBase;
}
