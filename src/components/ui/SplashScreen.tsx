import { motion } from 'framer-motion';
import logoImg from '@/assets/logo.png';

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0d0e14 0%, #131428 50%, #0d0e14 100%)' }}
    >
      {/* Floating orbs */}
      <div className="orb-1 absolute top-[12%] left-[15%] h-48 w-48 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #8b5cf650 0%, transparent 70%)' }} />
      <div className="orb-2 absolute bottom-[18%] right-[10%] h-64 w-64 rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #6366f145 0%, transparent 70%)' }} />
      <div className="orb-3 absolute top-[55%] left-[8%] h-32 w-32 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #f59e0b35 0%, transparent 70%)' }} />
      <div className="absolute bottom-[40%] right-[20%] h-20 w-20 rounded-full opacity-15 orb-1"
        style={{ background: 'radial-gradient(circle, #8b5cf660 0%, transparent 70%)' }} />

      {/* Subtle grid lines */}
      <div className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo orb */}
        <motion.div
          initial={{ scale: 0.4, opacity: 0, rotate: -15 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
          className="relative"
        >
          {/* Outer glow ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-[32px]"
            style={{ background: 'radial-gradient(circle, #8b5cf650 0%, transparent 70%)', margin: '-16px' }}
          />
          {/* Logo image */}
          <div
            className="relative flex h-24 w-24 items-center justify-center rounded-[28px] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 60%, #4f46e5 100%)',
              boxShadow: '0 0 40px #8b5cf660, 0 0 80px #8b5cf630, inset 0 1px 0 #ffffff25',
            }}
          >
            <img src={logoImg} alt="ToolVerse" className="h-20 w-20 object-cover rounded-[24px]" />
          </div>
        </motion.div>

        {/* App name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-1.5"
        >
          <h1
            className="font-display text-3xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #f0eeff 30%, #a78bfa 60%, #f0eeff 90%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 3s linear infinite',
            }}
          >
            ToolVerse
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: '#8b8aaa', letterSpacing: '0.2em' }}
          >
            Your Tool Universe
          </motion.p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-24 h-0.5 rounded-full overflow-hidden"
          style={{ background: '#2a2d45' }}
        >
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
            className="h-full w-1/2 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent, #8b5cf6, #a78bfa, transparent)' }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
