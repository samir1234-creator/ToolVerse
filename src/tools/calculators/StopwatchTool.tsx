import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { haptics } from '@/utils/haptics';

export default function StopwatchTool() {
  const [timeMs, setTimeMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - timeMs;
      intervalRef.current = setInterval(() => {
        setTimeMs(Date.now() - startTime);
      }, 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const toggleRun = () => {
    haptics.medium();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    haptics.light();
    setIsRunning(false);
    setTimeMs(0);
    setLaps([]);
  };

  const handleLap = () => {
    if (!isRunning) return;
    haptics.light();
    setLaps((prev) => [timeMs, ...prev]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return {
      min: String(minutes).padStart(2, '0'),
      sec: String(seconds).padStart(2, '0'),
      ms: String(milliseconds).padStart(2, '0'),
    };
  };

  const formatted = formatTime(timeMs);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Stopwatch & Timer" subtitle="Millisecond precision stopwatch with lap history" />
      <div className="space-y-6 px-4 pb-28 pt-4 max-w-md mx-auto flex flex-col items-center">
        {/* Main Display */}
        <div className="w-full rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-8 text-center shadow-xl">
          <div className="font-mono text-6xl font-extrabold text-[var(--color-text)] tracking-tight tabular-nums">
            {formatted.min}:{formatted.sec}
            <span className="text-3xl text-[var(--color-accent)] ml-1">.{formatted.ms}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={handleReset}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-text-muted)] active:scale-95 transition-all"
          >
            <RotateCcw size={22} />
          </button>

          <button
            onClick={toggleRun}
            className={`flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl active:scale-95 transition-all ${
              isRunning ? 'bg-[var(--color-danger)] shadow-rose-500/20' : 'bg-[var(--color-accent)] shadow-purple-500/20'
            }`}
          >
            {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>

          <button
            onClick={handleLap}
            disabled={!isRunning}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-line)] bg-[var(--color-surface-2)] text-[var(--color-text)] active:scale-95 transition-all disabled:opacity-40"
          >
            <Flag size={22} />
          </button>
        </div>

        {/* Laps List */}
        {laps.length > 0 && (
          <div className="w-full rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 space-y-2 max-h-56 overflow-y-auto">
            <span className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider block px-2 mb-2">
              Laps ({laps.length})
            </span>
            {laps.map((lapMs, idx) => {
              const lapTime = formatTime(lapMs);
              return (
                <div key={idx} className="flex justify-between items-center rounded-xl bg-[var(--color-surface-2)] px-4 py-2.5 text-sm">
                  <span className="font-semibold text-[var(--color-text-muted)]">Lap {laps.length - idx}</span>
                  <span className="font-mono font-bold text-[var(--color-text)]">
                    {lapTime.min}:{lapTime.sec}.{lapTime.ms}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
