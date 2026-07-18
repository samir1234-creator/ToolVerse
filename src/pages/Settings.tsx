import { motion } from 'framer-motion';
import { Moon, Sun, Smartphone, Info, Heart, Code2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Toggle } from '@/components/ui/Toggle';
import { useAppStore } from '@/hooks/useAppStore';
import { pageVariants } from '@/animations/variants';
import { haptics, setHapticsEnabled } from '@/utils/haptics';

const THEME_OPTIONS = [
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'system', label: 'System', icon: Smartphone },
] as const;

export default function Settings() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const animationsEnabled = useAppStore((s) => s.animationsEnabled);
  const setAnimationsEnabled = useAppStore((s) => s.setAnimationsEnabled);
  const hapticsEnabled = useAppStore((s) => s.hapticsEnabled);
  const setHapticsEnabledStore = useAppStore((s) => s.setHapticsEnabled);


  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Settings" />
      <div className="space-y-6 px-4 pb-28 pt-5">
        <section>
          <h2 className="mb-3 font-display text-base font-semibold text-[var(--color-text)]">Appearance</h2>
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-[var(--color-surface)] p-1.5">
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    haptics.light();
                    setTheme(opt.id);
                  }}
                  className={`flex flex-col items-center gap-1.5 rounded-xl py-3 transition-colors ${active ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)]'}`}
                >
                  <Icon size={18} />
                  <span className="text-xs font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold text-[var(--color-text)]">Experience</h2>
          <div className="divide-y divide-[var(--color-line)] rounded-2xl bg-[var(--color-surface)] px-4">
            <div className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-[15px] text-[var(--color-text)]">Animations</p>
                <p className="text-xs text-[var(--color-text-muted)]">Smooth transitions & effects</p>
              </div>
              <Toggle checked={animationsEnabled} onChange={setAnimationsEnabled} />
            </div>
            <div className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-[15px] text-[var(--color-text)]">Haptic Feedback</p>
                <p className="text-xs text-[var(--color-text-muted)]">Vibration on interactions</p>
              </div>
              <Toggle
                checked={hapticsEnabled}
                onChange={(v) => {
                  setHapticsEnabledStore(v);
                  setHapticsEnabled(v);
                }}
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-base font-semibold text-[var(--color-text)]">About</h2>

          {/* Developer credit card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mb-3 rounded-3xl p-5 text-center"
            style={{
              background: 'linear-gradient(145deg, #8b5cf618, #6366f110)',
              border: '1px solid #8b5cf630',
              boxShadow: '0 4px 24px #8b5cf614',
            }}
          >
            {/* Avatar orb */}
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', boxShadow: '0 4px 20px #8b5cf650' }}>
              <Code2 size={28} color="white" strokeWidth={2} />
            </div>
            <p className="font-display text-base font-bold text-[var(--color-text)]">Developed by Samir</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Built with passion &amp; precision</p>
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <Heart size={12} fill="#f43f5e" color="#f43f5e" />
              <span className="text-[11px] font-medium" style={{ color: '#8b5cf6' }}>ToolVerse</span>
            </div>
          </motion.div>

          {/* Version row */}
          <div className="flex items-center gap-3 rounded-2xl bg-[var(--color-surface)] px-4 py-3.5" style={{ border: '1px solid var(--color-line)' }}>
            <Info size={18} className="text-[var(--color-text-muted)]" />
            <div>
              <p className="text-[15px] text-[var(--color-text)]">App Version</p>
              <p className="text-xs text-[var(--color-text-muted)]">ToolVerse 1.0.0</p>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
