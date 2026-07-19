import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Clock, Star, Calculator, Sigma, Percent, Receipt, Landmark } from 'lucide-react';
import { ToolCard } from '@/components/tools/ToolCard';
import { tools, getToolById } from '@/constants/tools';
import { useAppStore } from '@/hooks/useAppStore';
import { pageVariants, staggerContainer, staggerItem } from '@/animations/variants';
import { haptics } from '@/utils/haptics';
import logoImg from '@/assets/logo.png';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5)  return { text: 'Working late?',   emoji: '🌙' };
  if (hour < 12) return { text: 'Good morning',    emoji: '☀️' };
  if (hour < 17) return { text: 'Good afternoon',  emoji: '⚡' };
  if (hour < 21) return { text: 'Good evening',    emoji: '🌆' };
  return          { text: 'Good night',             emoji: '🌙' };
}

// Quick-access hero tools shown as big cards at top
const HERO_TOOLS = [
  { id: 'basic',      icon: Calculator, label: 'Calculator', color: '#8b5cf6', bg: '#8b5cf620' },
  { id: 'scientific', icon: Sigma,      label: 'Scientific',  color: '#6366f1', bg: '#6366f120' },
  { id: 'percentage', icon: Percent,    label: 'Percentage',  color: '#f59e0b', bg: '#f59e0b20' },
  { id: 'gst',        icon: Receipt,    label: 'GST',         color: '#10b981', bg: '#10b98120' },
  { id: 'emi',        icon: Landmark,   label: 'EMI',         color: '#f43f5e', bg: '#f43f5e20' },
];

export default function Home() {
  const navigate = useNavigate();
  const recents   = useAppStore((s) => s.recents);
  const favorites = useAppStore((s) => s.favorites);
  const addRecent = useAppStore((s) => s.addRecent);

  const recentTools = useMemo(
    () => recents.map((id) => getToolById(id)).filter(Boolean).slice(0, 8) as typeof tools,
    [recents]
  );
  const favoriteTools = useMemo(
    () => favorites.map((id) => getToolById(id)).filter(Boolean).slice(0, 6) as typeof tools,
    [favorites]
  );
  const popularTools = useMemo(() => tools.filter((t) => t.popular), []);

  const { text: greeting, emoji } = getGreeting();

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="gradient-mesh">

      <div
        className="sticky top-0 z-30 px-5 pb-4 pt-[calc(env(safe-area-inset-top)+36px)]"
        style={{
          background: 'linear-gradient(180deg, var(--color-bg) 70%, transparent 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Greeting row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-display text-2xl font-bold text-[var(--color-text)] leading-tight">
              {greeting} {emoji}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-0.5">What tool do you need today?</p>
          </div>
          {/* Logo orb */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', boxShadow: '0 4px 16px #8b5cf640' }}
          >
            <img src={logoImg} alt="ToolVerse" className="h-9 w-9 rounded-xl object-cover" />
          </motion.div>
        </div>

        {/* Search bar */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => { haptics.light(); navigate('/search'); }}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            boxShadow: '0 2px 12px #8b5cf610',
          }}
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: '#8b5cf620' }}>
            <Search size={14} color="#8b5cf6" />
          </div>
          <span className="flex-1 text-sm text-[var(--color-text-muted)]">Search 45+ tools…</span>
          <span
            className="rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
            style={{ background: '#8b5cf615', color: '#8b5cf6' }}
          >
            ⌘K
          </span>
        </motion.button>
      </div>

      {/* ── Content ──────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8 px-5 pb-32 pt-2"
      >

        {/* Hero quick-access grid */}
        <motion.section variants={staggerItem}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Quick Access
            </h2>
            <Sparkles size={14} color="var(--color-accent)" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5">
            {HERO_TOOLS.map((h, i) => {
              const tool = getToolById(h.id);
              if (!tool) return null;
              const Icon = h.icon;
              return (
                <motion.button
                  key={h.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, type: 'spring', stiffness: 360, damping: 26 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => { haptics.light(); addRecent(h.id); navigate(tool.route); }}
                  className="flex-shrink-0 flex flex-col items-center justify-center gap-2 rounded-3xl p-4"
                  style={{
                    width: '5.5rem',
                    minHeight: '6rem',
                    background: `linear-gradient(145deg, ${h.bg}, ${h.color}12)`,
                    border: `1px solid ${h.color}30`,
                    boxShadow: `0 4px 20px ${h.color}18`,
                  }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: h.bg, boxShadow: `0 2px 12px ${h.color}30` }}
                  >
                    <Icon size={22} color={h.color} strokeWidth={2} />
                  </div>
                  <span className="text-[11px] font-semibold leading-tight text-center" style={{ color: h.color }}>
                    {h.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* Recently Used */}
        {recentTools.length > 0 && (
          <motion.section variants={staggerItem}>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} color="var(--color-text-muted)" />
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                Recently Used
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-5 px-5">
              {recentTools.map((t) => (
                <ToolCard key={t.id} tool={t} variant="compact" showFavorite={false} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Favorites */}
        {favoriteTools.length > 0 && (
          <motion.section variants={staggerItem}>
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} color="var(--color-warm)" />
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
                Favourites
              </h2>
            </div>
            <div className="space-y-2.5">
              {favoriteTools.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Popular */}
        <motion.section variants={staggerItem}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} color="var(--color-accent)" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              Popular
            </h2>
          </div>
          <div className="space-y-2.5">
            {popularTools.map((t) => (
              <ToolCard key={t.id} tool={t} />
            ))}
          </div>
        </motion.section>

      </motion.div>
    </motion.div>
  );
}
