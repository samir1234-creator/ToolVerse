import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { RotateCcw } from 'lucide-react';
import Base64Tool from './Base64Tool';
import BinaryHexOctalTool from './BinaryHexOctalTool';
import AsciiTool from './AsciiTool';
import UuidTool from './UuidTool';
import PasswordGeneratorTool from './PasswordGeneratorTool';
import HashGeneratorTool from './HashGeneratorTool';
import RomanNumeralsTool from './RomanNumeralsTool';
import RandomNumberTool from './RandomNumberTool';
import QrGeneratorTool from './QrGeneratorTool';
import QrScannerTool from './QrScannerTool';
import BarcodeGeneratorTool from './BarcodeGeneratorTool';
import ColorPickerTool from './ColorPickerTool';
import UrlEncoderTool from './UrlEncoderTool';
import JsonFormatterTool from './JsonFormatterTool';
import DeviceInfoTool from './DeviceInfoTool';
import BatteryInfoTool from './BatteryInfoTool';
import GradientGeneratorTool from './GradientGeneratorTool';

const registry: Record<string, React.ComponentType> = {
  base64: Base64Tool,
  'binary-hex-octal': BinaryHexOctalTool,
  ascii: AsciiTool,
  uuid: UuidTool,
  'password-generator': PasswordGeneratorTool,
  'hash-generator': HashGeneratorTool,
  'roman-numerals': RomanNumeralsTool,
  'random-number': RandomNumberTool,
  'qr-generator': QrGeneratorTool,
  'qr-scanner': QrScannerTool,
  'barcode-generator': BarcodeGeneratorTool,
  'color-picker': ColorPickerTool,
  'url-encoder': UrlEncoderTool,
  'json-formatter': JsonFormatterTool,
  'device-info': DeviceInfoTool,
  'battery-info': BatteryInfoTool,
  'gradient-generator': GradientGeneratorTool,
};

export default function DevToolPage() {
  const { id = '' } = useParams();
  const Tool = registry[id];
  if (!Tool) {
    return (
      <div>
        <PageHeader title="Not found" />
        <EmptyState icon={RotateCcw} title="Tool not found" description="This tool may have moved." />
      </div>
    );
  }
  return <Tool />;
}
