import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Monitor, Cpu, Globe, Compass } from 'lucide-react';

export default function DeviceInfoTool() {
  const info = {
    screen: `${window.screen.width} x ${window.screen.height}`,
    viewport: `${window.innerWidth} x ${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio,
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: (navigator as any).userAgentData?.platform || navigator.platform,
    cores: navigator.hardwareConcurrency || 'N/A',
    memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'N/A',
    online: navigator.onLine ? 'Connected' : 'Offline',
    cookieEnabled: navigator.cookieEnabled ? 'Yes' : 'No',
    touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0 ? 'Yes' : 'No',
  };

  const sections = [
    {
      title: 'Display & Screen',
      icon: Monitor,
      items: [
        ['Screen Resolution', info.screen],
        ['Viewport Size', info.viewport],
        ['Device Pixel Ratio', `${info.pixelRatio}x`],
        ['Touch Screen Support', info.touchSupport],
      ]
    },
    {
      title: 'System & Hardware',
      icon: Cpu,
      items: [
        ['Platform / OS', info.platform],
        ['CPU Cores', info.cores],
        ['Device Memory', info.memory],
      ]
    },
    {
      title: 'Browser & Environment',
      icon: Globe,
      items: [
        ['Preferred Language', info.language],
        ['Cookies Enabled', info.cookieEnabled],
        ['Network Status', info.online],
      ]
    },
    {
      title: 'User Agent String',
      icon: Compass,
      fullWidth: true,
      content: info.userAgent,
    }
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Device Information" subtitle="Details of your display, hardware & browser" />
      <div className="space-y-5 px-4 pb-28 pt-5">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <div key={idx} className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-3.5">
              <div className="flex items-center gap-2 border-b border-[var(--color-line)] pb-2.5">
                <Icon size={16} className="text-[var(--color-accent)]" />
                <h3 className="font-display text-sm font-semibold text-[var(--color-text)]">{section.title}</h3>
              </div>

              {section.items ? (
                <div className="grid grid-cols-1 gap-2.5">
                  {section.items.map(([label, value]) => (
                    <div key={label} className="flex justify-between items-center text-sm">
                      <span className="text-[var(--color-text-muted)] font-medium">{label}</span>
                      <span className="font-mono font-semibold text-[var(--color-text)]">{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-mono text-xs text-[var(--color-text-muted)] bg-[var(--color-surface-2)] p-3 rounded-xl border border-[var(--color-line)] break-all leading-normal">
                  {section.content}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
