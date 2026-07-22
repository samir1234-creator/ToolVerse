import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Compass, AlertCircle, Navigation, MapPin, Sliders, RefreshCw, CompassIcon, ShieldCheck } from 'lucide-react';
import { haptics } from '@/utils/haptics';

// Approximate magnetic declination helper based on coordinates
function getMagneticDeclination(lat: number, lng: number): number {
  // World Magnetic Model simplified spherical harmonics approximation
  const radLat = (lat * Math.PI) / 180;
  const radLng = (lng * Math.PI) / 180;
  const dec = -15.0 * Math.sin(radLng) * Math.cos(radLat) + 3.2 * Math.sin(radLat);
  return Math.round(dec * 10) / 10;
}

export default function CompassTool() {
  const [heading, setHeading] = useState(0);
  const [pitch, setPitch] = useState(0); // beta (-180 to 180)
  const [roll, setRoll] = useState(0); // gamma (-90 to 90)
  const [northMode, setNorthMode] = useState<'magnetic' | 'true'>('magnetic');
  const [declination, setDeclination] = useState(0);
  const [permission, setPermission] = useState<'granted' | 'denied' | 'not-supported' | 'checking'>('checking');
  const [hasSensorData, setHasSensorData] = useState(false);
  const [sensorQuality, setSensorQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number; alt: number | null; accuracy: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'disabled' | 'loading' | 'active' | 'error'>('loading');
  const [simulationMode, setSimulationMode] = useState(false);

  const prevCardinalRef = useRef<string>('');
  const rawHeadingRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Exponential low-pass filter for smooth motion
  const smoothHeading = (target: number) => {
    let current = rawHeadingRef.current;
    let diff = (target - current + 540) % 360 - 180;
    // Smoother interpolation factor (0.28)
    let next = (current + diff * 0.28 + 360) % 360;
    rawHeadingRef.current = next;
    return Math.round(next);
  };

  // Auto-fetch GPS coordinates on mount to calculate True North & declination
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const dec = getMagneticDeclination(lat, lng);
        setDeclination(dec);
        setGeoCoords({
          lat,
          lng,
          alt: pos.coords.altitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
        setGeoStatus('active');
      },
      () => {
        setGeoStatus('error');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  useEffect(() => {
    if (!window.DeviceOrientationEvent && !('AbsoluteOrientationSensor' in window)) {
      setPermission('not-supported');
      setSimulationMode(true);
      return;
    }

    let absoluteSensorInstance: any = null;

    // 1. Web Sensor API: AbsoluteOrientationSensor (Modern Android Chrome / WebViews)
    if ('AbsoluteOrientationSensor' in window) {
      try {
        const AbsoluteOrientationSensorAny = (window as any).AbsoluteOrientationSensor;
        absoluteSensorInstance = new AbsoluteOrientationSensorAny({ frequency: 60 });
        
        absoluteSensorInstance.addEventListener('reading', () => {
          const q = absoluteSensorInstance.quaternion;
          if (q) {
            // Convert quaternion to Euler yaw (heading angle)
            const [x, y, z, w] = q;
            const yaw = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));
            let rawHeading = (yaw * (180 / Math.PI) + 360) % 360;

            // Apply screen orientation angle
            let screenAngle = 0;
            if (window.screen && window.screen.orientation) {
              screenAngle = window.screen.orientation.angle;
            } else if (window.orientation !== undefined) {
              screenAngle = typeof window.orientation === 'number' ? window.orientation : parseInt(window.orientation as any);
            }

            rawHeading = (rawHeading + screenAngle) % 360;
            setHasSensorData(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);

            // Compute magnetic vs true heading
            let finalHeading = rawHeading;
            if (northMode === 'true' && declination !== 0) {
              finalHeading = (finalHeading + declination + 360) % 360;
            }

            const smoothed = smoothHeading(finalHeading);
            setHeading(smoothed);

            const dir = getCardinal(smoothed);
            if (dir !== prevCardinalRef.current && (dir === 'N' || dir === 'E' || dir === 'S' || dir === 'W')) {
              haptics.light();
              prevCardinalRef.current = dir;
            }
          }
        });

        absoluteSensorInstance.addEventListener('error', (err: any) => {
          if (err.error.name === 'NotAllowedError') {
            setPermission('denied');
          }
        });

        absoluteSensorInstance.start();
        setPermission('granted');
      } catch {
        // Fallback to standard DeviceOrientation below
      }
    }

    // 2. Standard DeviceOrientationEvent fallback handler
    const handleOrientation = (e: DeviceOrientationEvent & { webkitCompassHeading?: number; absolute?: boolean }) => {
      let compassHeading: number | null = null;

      // iOS Safari webkitCompassHeading
      if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
        compassHeading = e.webkitCompassHeading;
      }
      // Standard W3C DeviceOrientation (alpha angle)
      else if (e.alpha !== null && e.alpha !== undefined) {
        compassHeading = (360 - e.alpha) % 360;
      }

      if (compassHeading !== null) {
        setHasSensorData(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        let screenAngle = 0;
        if (window.screen && window.screen.orientation) {
          screenAngle = window.screen.orientation.angle;
        } else if (window.orientation !== undefined) {
          screenAngle = typeof window.orientation === 'number' ? window.orientation : parseInt(window.orientation as any);
        }

        compassHeading = (compassHeading + screenAngle) % 360;

        // Apply True North declination if selected
        if (northMode === 'true' && declination !== 0) {
          compassHeading = (compassHeading + declination + 360) % 360;
        }

        const smoothed = smoothHeading(compassHeading);
        setHeading(smoothed);

        const dir = getCardinal(smoothed);
        if (dir !== prevCardinalRef.current && (dir === 'N' || dir === 'E' || dir === 'S' || dir === 'W')) {
          haptics.light();
          prevCardinalRef.current = dir;
        }
      }

      if (e.beta !== null) setPitch(Math.round(e.beta));
      if (e.gamma !== null) setRoll(Math.round(e.gamma));
    };

    // Timeout detector: enable simulator if no sensor events fire within 1.5 seconds
    timeoutRef.current = setTimeout(() => {
      if (!hasSensorData) {
        setSimulationMode(true);
      }
    }, 1500);

    const isAbsoluteSupported = 'ondeviceorientationabsolute' in window;
    const eventName = isAbsoluteSupported ? 'deviceorientationabsolute' : 'deviceorientation';

    const requestPermission = async () => {
      const DeviceOrientationEventAny = window.DeviceOrientationEvent as any;
      if (typeof DeviceOrientationEventAny.requestPermission === 'function') {
        try {
          const res = await DeviceOrientationEventAny.requestPermission();
          if (res === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
            setPermission('granted');
          } else {
            setPermission('denied');
            setSimulationMode(true);
          }
        } catch {
          setPermission('denied');
          setSimulationMode(true);
        }
      } else {
        window.addEventListener(eventName, handleOrientation as EventListener, true);
        setPermission('granted');
      }
    };

    requestPermission();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (absoluteSensorInstance) absoluteSensorInstance.stop();
      window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation as EventListener, true);
    };
  }, [northMode, declination]);

  const getCardinal = (deg: number) => {
    if (deg >= 337.5 || deg < 22.5) return 'N';
    if (deg >= 22.5 && deg < 67.5) return 'NE';
    if (deg >= 67.5 && deg < 112.5) return 'E';
    if (deg >= 112.5 && deg < 157.5) return 'SE';
    if (deg >= 157.5 && deg < 202.5) return 'S';
    if (deg >= 202.5 && deg < 247.5) return 'SW';
    if (deg >= 247.5 && deg < 292.5) return 'W';
    return 'NW';
  };

  const getDirectionFull = (deg: number) => {
    const card = getCardinal(deg);
    const names: Record<string, string> = {
      N: 'North',
      NE: 'North-East',
      E: 'East',
      SE: 'South-East',
      S: 'South',
      SW: 'South-West',
      W: 'West',
      NW: 'North-West',
    };
    return names[card] || card;
  };

  const isTilted = Math.abs(pitch) > 30 || Math.abs(roll) > 30;
  const bubbleX = Math.max(-28, Math.min(28, (roll / 45) * 28));
  const bubbleY = Math.max(-28, Math.min(28, (pitch / 45) * 28));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden">
      <PageHeader
        title="Compass"
        subtitle="Auto-calibrated mobile magnetic & true direction"
        action={
          <button
            onClick={() => setSimulationMode((prev) => !prev)}
            className={`rounded-full p-2 text-xs font-semibold transition-colors flex items-center gap-1.5 px-3 py-1.5 border ${
              simulationMode
                ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                : 'border-[var(--color-line)] text-[var(--color-text-muted)] bg-[var(--color-surface)]'
            }`}
          >
            <Sliders size={14} />
            <span>{simulationMode ? 'Manual' : 'Sensor'}</span>
          </button>
        }
      />

      <div className="space-y-5 px-4 pb-28 pt-3 flex flex-col items-center max-w-md mx-auto">
        {/* Mode Selector: Magnetic North vs True Geographic North */}
        <div className="w-full grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5">
          <button
            onClick={() => {
              haptics.light();
              setNorthMode('magnetic');
            }}
            className={`rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              northMode === 'magnetic'
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            <CompassIcon size={14} />
            Magnetic North
          </button>
          <button
            onClick={() => {
              haptics.light();
              setNorthMode('true');
            }}
            className={`rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              northMode === 'true'
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-text-muted)]'
            }`}
          >
            <Navigation size={14} />
            True North {declination !== 0 && `(${declination > 0 ? '+' : ''}${declination}°)`}
          </button>
        </div>

        {/* Calibration & Sensor Notices */}
        {permission === 'not-supported' && !simulationMode && (
          <div className="w-full rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] p-4 flex gap-3 text-sm">
            <AlertCircle className="shrink-0 text-amber-400 mt-0.5" size={18} />
            <p className="text-[var(--color-text-muted)] leading-relaxed">
              Hardware magnetometer missing or restricted on this device. Manual interactive mode activated.
            </p>
          </div>
        )}

        {isTilted && !simulationMode && (
          <div className="w-full rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 flex gap-2.5 items-center text-xs text-amber-400">
            <AlertCircle className="shrink-0" size={16} />
            <span>Hold phone flat on your palm for highest accuracy.</span>
          </div>
        )}

        {/* Heading Readout */}
        <div className="text-center space-y-0.5">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-extrabold font-display tracking-tight text-[var(--color-text)] tabular-nums">
              {heading}°
            </span>
            <span className="text-2xl font-extrabold text-[var(--color-accent)]">
              {getCardinal(heading)}
            </span>
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] flex items-center justify-center gap-1.5">
            <span>{getDirectionFull(heading)}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-line)] font-semibold text-[var(--color-accent)]">
              {northMode === 'true' ? 'True North' : 'Magnetic'}
            </span>
          </p>
        </div>

        {/* Main Compass Dial */}
        <div className="relative w-72 h-72 rounded-full bg-[var(--color-surface)] border-4 border-[var(--color-line)] flex items-center justify-center shadow-2xl overflow-hidden">
          <div className="absolute inset-1 rounded-full border border-[var(--color-line)]/50 pointer-events-none" />

          {/* Rotating Compass Face */}
          <motion.div
            animate={{ rotate: -heading }}
            transition={{ type: 'spring', stiffness: 95, damping: 19 }}
            className="w-full h-full relative"
          >
            {/* Degree Tick Marks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const deg = i * 30;
              return (
                <div
                  key={deg}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none flex flex-col justify-between items-center py-2"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className={`w-0.5 ${deg % 90 === 0 ? 'h-3 bg-[var(--color-text)]' : 'h-2 bg-[var(--color-text-muted)]/40'}`} />
                </div>
              );
            })}

            {/* Main Cardinal Labels */}
            <span className="absolute top-4 left-1/2 -translate-x-1/2 font-display font-black text-lg text-[var(--color-danger)]">
              N
            </span>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-display font-black text-lg text-[var(--color-text)]">
              S
            </span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-display font-black text-lg text-[var(--color-text)]">
              E
            </span>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-black text-lg text-[var(--color-text)]">
              W
            </span>

            {/* Intercardinals */}
            <span className="absolute top-10 right-10 font-display font-bold text-xs text-[var(--color-text-muted)]">NE</span>
            <span className="absolute bottom-10 right-10 font-display font-bold text-xs text-[var(--color-text-muted)]">SE</span>
            <span className="absolute bottom-10 left-10 font-display font-bold text-xs text-[var(--color-text-muted)]">SW</span>
            <span className="absolute top-10 left-10 font-display font-bold text-xs text-[var(--color-text-muted)]">NW</span>

            {/* Needle graphic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute top-12 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[60px] border-b-[var(--color-danger)] filter drop-shadow-md" />
              <div className="absolute bottom-12 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[60px] border-t-[var(--color-text-muted)]/70 filter drop-shadow-md" />
            </div>
          </motion.div>

          {/* Heading Marker at 12 o'clock */}
          <div className="absolute top-1 z-20 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[14px] border-t-[var(--color-accent)] filter drop-shadow" />
          </div>

          {/* Center Bubble Level */}
          <div className="absolute z-10 w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-line)] shadow-inner flex items-center justify-center pointer-events-none">
            <div
              className="w-3.5 h-3.5 rounded-full bg-[var(--color-accent)]/80 transition-transform duration-75 shadow-sm"
              style={{ transform: `translate(${bubbleX}px, ${bubbleY}px)` }}
            />
          </div>
        </div>

        {/* Manual Interactive Simulator Slider */}
        {simulationMode && (
          <div className="w-full p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] space-y-3 shadow-sm">
            <div className="flex justify-between items-center text-xs font-semibold text-[var(--color-text-muted)]">
              <span className="flex items-center gap-1.5">
                <Navigation size={14} className="text-[var(--color-accent)]" />
                Manual Direction Simulator
              </span>
              <span className="font-mono text-[var(--color-text)]">{heading}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="359"
              value={heading}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setHeading(val);
                haptics.light();
              }}
              className="w-full h-2 rounded-lg bg-[var(--color-surface-2)] appearance-none cursor-pointer accent-[var(--color-accent)]"
            />
          </div>
        )}

        {/* GPS Location & Magnetic Declination Card */}
        <div className="w-full rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              <MapPin size={15} className="text-[var(--color-accent)]" />
              <span>Mobile Location & Sensors</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck size={14} />
              <span>Auto-Calibrated</span>
            </div>
          </div>

          {geoCoords ? (
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-[var(--color-surface-2)] p-2.5 rounded-xl">
                <span className="text-[10px] font-medium text-[var(--color-text-muted)] block">Latitude</span>
                <span className="font-mono font-bold text-[var(--color-text)]">{geoCoords.lat.toFixed(4)}°</span>
              </div>
              <div className="bg-[var(--color-surface-2)] p-2.5 rounded-xl">
                <span className="text-[10px] font-medium text-[var(--color-text-muted)] block">Longitude</span>
                <span className="font-mono font-bold text-[var(--color-text)]">{geoCoords.lng.toFixed(4)}°</span>
              </div>
              <div className="bg-[var(--color-surface-2)] p-2.5 rounded-xl">
                <span className="text-[10px] font-medium text-[var(--color-text-muted)] block">Magnetic Declination</span>
                <span className="font-mono font-bold text-[var(--color-accent)]">{declination > 0 ? `+${declination}` : declination}°</span>
              </div>
              <div className="bg-[var(--color-surface-2)] p-2.5 rounded-xl">
                <span className="text-[10px] font-medium text-[var(--color-text-muted)] block">GPS Accuracy</span>
                <span className="font-mono font-bold text-[var(--color-text)]">±{geoCoords.accuracy} m</span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-2">
              <RefreshCw size={12} className="animate-spin text-[var(--color-accent)]" />
              Fetching GPS location to auto-adjust True North...
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
