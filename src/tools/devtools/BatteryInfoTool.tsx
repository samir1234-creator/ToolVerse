import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { BatteryCharging, Battery, Info, AlertTriangle } from 'lucide-react';

interface BatteryState {
  level: number;
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  supported: boolean;
}

export default function BatteryInfoTool() {
  const [battery, setBattery] = useState<BatteryState>({
    level: 1,
    charging: false,
    chargingTime: 0,
    dischargingTime: 0,
    supported: true,
  });

  useEffect(() => {
    if (!('getBattery' in navigator)) {
      setBattery(prev => ({ ...prev, supported: false }));
      return;
    }

    let batteryInstance: any = null;

    const updateBatteryInfo = (batt: any) => {
      setBattery({
        level: batt.level,
        charging: batt.charging,
        chargingTime: batt.chargingTime,
        dischargingTime: batt.dischargingTime,
        supported: true,
      });
    };

    (navigator as any).getBattery().then((batt: any) => {
      batteryInstance = batt;
      updateBatteryInfo(batt);

      batt.addEventListener('chargingchange', () => updateBatteryInfo(batt));
      batt.addEventListener('levelchange', () => updateBatteryInfo(batt));
      batt.addEventListener('chargingtimechange', () => updateBatteryInfo(batt));
      batt.addEventListener('dischargingtimechange', () => updateBatteryInfo(batt));
    });

    return () => {
      if (batteryInstance) {
        batteryInstance.removeEventListener('chargingchange', () => {});
        batteryInstance.removeEventListener('levelchange', () => {});
        batteryInstance.removeEventListener('chargingtimechange', () => {});
        batteryInstance.removeEventListener('dischargingtimechange', () => {});
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    if (seconds === Infinity) return 'Calculating...';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const percentage = Math.round(battery.level * 100);

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <PageHeader title="Battery Information" subtitle="Real-time status of your device battery" />
      <div className="space-y-5 px-4 pb-28 pt-5">
        {!battery.supported ? (
          <div className="rounded-3xl border border-[var(--color-danger)]/30 bg-[var(--color-danger-soft)]/20 p-5 flex items-start gap-3 text-[var(--color-danger)]">
            <AlertTriangle className="shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">Not Supported</h3>
              <p className="text-xs mt-1 leading-normal opacity-80">
                The Battery Status API is not supported by your current browser or platform (e.g., iOS Safari).
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-6 flex flex-col items-center justify-center space-y-5">
              <div className="relative flex items-center justify-center">
                <div className="w-32 h-16 border-4 border-[var(--color-text)] rounded-2xl p-1 relative flex items-center">
                  <div
                    className={`h-full rounded-lg transition-all duration-500 ${battery.charging ? 'bg-green-400' : percentage <= 20 ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-accent)]'}`}
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-2.5 h-6 bg-[var(--color-text)] rounded-r-md" />
                </div>
                {battery.charging && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute text-white"
                  >
                    <BatteryCharging size={32} className="text-green-300 drop-shadow-md" />
                  </motion.div>
                )}
              </div>

              <div className="text-center">
                <span className="text-4xl font-extrabold font-display text-[var(--color-text)]">{percentage}%</span>
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mt-1.5 flex items-center justify-center gap-1">
                  {battery.charging ? (
                    <>
                      <BatteryCharging size={12} className="text-green-400" />
                      Charging
                    </>
                  ) : (
                    <>
                      <Battery size={12} />
                      Discharging
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-[var(--color-line)] bg-[var(--color-surface)] p-5 space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--color-line)] pb-2.5">
                <Info size={16} className="text-[var(--color-accent)]" />
                <h3 className="font-display text-sm font-semibold text-[var(--color-text)]">Battery Details</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)] font-medium">Power Status</span>
                  <span className="font-semibold text-[var(--color-text)]">{battery.charging ? 'Plugged In' : 'On Battery'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-text-muted)] font-medium">Battery Level</span>
                  <span className="font-semibold text-[var(--color-text)]">{percentage}%</span>
                </div>
                {battery.charging && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] font-medium">Time to Full</span>
                    <span className="font-mono font-semibold text-[var(--color-text)]">{formatTime(battery.chargingTime)}</span>
                  </div>
                )}
                {!battery.charging && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-muted)] font-medium">Time to Empty</span>
                    <span className="font-mono font-semibold text-[var(--color-text)]">{formatTime(battery.dischargingTime)}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
