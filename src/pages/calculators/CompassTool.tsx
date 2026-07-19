import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Compass, AlertCircle } from 'lucide-react';
import { haptics } from '@/utils/haptics';

export default function CompassTool() {
  const [heading, setHeading] = useState(0);
  const [permission, setPermission] = useState<string | null>(null);

  useEffect(() => {
    // Check if device orientation is supported
    if (!window.DeviceOrientationEvent) {
      setPermission('not-supported');
      return;
    }

    const handleOrientation = (e: any) => {
      let compassHeading = 0;
      if (e.webkitCompassHeading !== undefined) {
        compassHeading = e.webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Standard alpha is counter-clockwise.
        // On Android WebView, e.alpha=0 corresponds to West instead of North.
        // We correct this 90-degree offset by subtracting 90 degrees.
        compassHeading = (360 - e.alpha - 90 + 360) % 360;
      }

      // Add screen orientation offset to adjust for landscape/portrait rotation
      let screenAngle = 0;
      if (window.screen && window.screen.orientation) {
        screenAngle = window.screen.orientation.angle;
      } else if (window.orientation !== undefined) {
        screenAngle = typeof window.orientation === 'number' ? window.orientation : parseInt(window.orientation);
      }

      compassHeading = (compassHeading + screenAngle) % 360;
      setHeading(Math.round(compassHeading));
    };

    // Determine absolute orientation event support (Chrome/Android webviews)
    const isAbsoluteSupported = 'ondeviceorientationabsolute' in window;
    const eventName = isAbsoluteSupported ? 'deviceorientationabsolute' : 'deviceorientation';

    // Request permissions for iOS 13+ devices
    const requestPermission = async () => {
      const doc = window.DeviceOrientationEvent as any;
      if (typeof doc.requestPermission === 'function') {
        try {
          const res = await doc.requestPermission();
          if (res === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
            setPermission('granted');
          } else {
            setPermission('denied');
          }
        } catch {
          setPermission('denied');
        }
      } else {
        // Android / Non-iOS doesn't require explicit popup
        window.addEventListener(eventName, handleOrientation, true);
        setPermission('granted');
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    };
  }, []);

  const getDirection = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'N';
    if (deg >= 22.5 && deg < 67.5) return 'NE';
    if (deg >= 67.5 && deg < 112.5) return 'E';
    if (deg >= 112.5 && deg < 157.5) return 'SE';
    if (deg >= 157.5 && deg < 202.5) return 'S';
    if (deg >= 202.5 && deg < 247.5) return 'SW';
    if (deg >= 247.5 && deg < 292.5) return 'W';
    return 'NW';
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden">
      <PageHeader title="Compass" subtitle="Device direction sensor heading" />
      <div className="space-y-6 px-4 pb-28 pt-5 flex flex-col items-center">
        
        {/* Permission Warnings */}
        {permission === 'not-supported' && (
          <div className="w-full rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] p-4 flex gap-3 text-[var(--color-text-muted)] text-sm">
            <AlertCircle className="shrink-0 text-orange-400 mt-0.5" />
            <p className="leading-relaxed">
              No hardware compass detected on this device. Showing mock simulated dials.
            </p>
          </div>
        )}

        {/* Big Rotating Compass dial */}
        <div className="relative w-64 h-64 mt-5 rounded-full bg-[var(--color-surface)] border-4 border-[var(--color-line)] flex items-center justify-center shadow-lg">
          {/* Degree ticks around outer ring */}
          <div className="absolute inset-2 rounded-full border border-[var(--color-line)] opacity-40" />

          {/* Core Compass Face */}
          <motion.div
            animate={{ rotate: -heading }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            className="w-full h-full relative"
          >
            {/* Compass Labels */}
            <span className="absolute top-3 left-1/2 -translate-x-1/2 font-display font-extrabold text-sm text-[var(--color-danger)]">N</span>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 font-display font-extrabold text-sm text-[var(--color-text)]">S</span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-display font-extrabold text-sm text-[var(--color-text)]">E</span>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-display font-extrabold text-sm text-[var(--color-text)]">W</span>

            {/* Inner lines */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="w-[1px] h-full bg-[var(--color-line)]" />
              <div className="h-[1px] w-full bg-[var(--color-line)] absolute" />
            </div>
          </motion.div>

          {/* Static needle center */}
          <div className="absolute w-5 h-5 bg-[var(--color-danger)] rounded-full shadow-md flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </div>

          {/* Compass Pointer Arrow */}
          <div className="absolute top-1 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[12px] border-b-[var(--color-danger)]" />
        </div>

        {/* Values and simulator slider */}
        <div className="w-full text-center space-y-4">
          <div>
            <span className="text-5xl font-extrabold font-display text-[var(--color-text)]">{heading}°</span>
            <span className="text-2xl font-bold ml-2 text-[var(--color-accent)]">{getDirection(heading)}</span>
          </div>

          {/* Interactive slider for testing if sensor is not available */}
          {permission === 'not-supported' && (
            <div className="w-full max-w-xs mx-auto p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] space-y-2">
              <div className="flex justify-between text-xs font-semibold text-[var(--color-text-muted)]">
                <span>Simulate Direction</span>
                <span>{heading}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={heading}
                onChange={(e) => {
                  setHeading(parseInt(e.target.value));
                  haptics.light();
                }}
                className="w-full h-1.5 rounded-lg bg-[var(--color-surface-2)] appearance-none cursor-pointer accent-[var(--color-accent)]"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
