import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, Heart, Settings } from 'lucide-react';
import { haptics } from '@/utils/haptics';

const tabs = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/categories', label: 'Categories', icon: LayoutGrid },
  { path: '/favorites', label: 'Favorites', icon: Heart },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const showNav = tabs.some(tab => tab.path === location.pathname);
  if (!showNav) return null;

  return (
    <nav
      className="glass-strong fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-line)] pt-2 pb-[calc(env(safe-area-inset-bottom)+20px)]"
      style={{ boxShadow: '0 -4px 24px #8b5cf610' }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.path}
              whileTap={{ scale: 0.86 }}
              onClick={() => {
                if (!active) {
                  haptics.light();
                  navigate(tab.path);
                }
              }}
              className="relative flex flex-1 flex-col items-center gap-1 py-2.5"
            >
              {/* Glow pill indicator */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="absolute top-1 h-9 w-9 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, #8b5cf635 0%, #8b5cf615 60%, transparent 100%)',
                      boxShadow: '0 0 16px #8b5cf640',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon with scale animation */}
              <motion.div
                animate={{ scale: active ? 1.12 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative z-10"
              >
                <Icon
                  size={21}
                  strokeWidth={active ? 2.2 : 1.8}
                  color={active ? 'var(--color-accent)' : 'var(--color-text-muted)'}
                />
              </motion.div>

              <span
                className="relative z-10 text-[10px] font-semibold tracking-wide"
                style={{
                  color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
                  textShadow: active ? '0 0 12px #8b5cf680' : 'none',
                }}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
