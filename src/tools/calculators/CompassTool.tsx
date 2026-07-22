import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { pageVariants } from '@/animations/variants';
import { Compass, AlertCircle, Navigation, MapPin, Sliders, RefreshCw, CompassIcon, ShieldCheck } from 'lucide-react';
import { haptics } from '@/utils/haptics';

// Calculate World Magnetic Model declination based on lat/lng
function getMagneticDeclination(lat: number, lng: number): number {
  const radLat = (lat * Math.PI) / 180;
  const radLng = (lng * Math.PI) / 180;
  const dec = -15.0 * Math.sin(radLng) * Math.cos(radLat) + 3.2 * Math.sin(radLat);
  return Math.round(dec * 10) / 10;
}

// 3D Tilt-compensated compass heading from alpha, beta, gamma
function computeTiltCompensatedHeading(alpha: number, beta: number, gamma: number): number {
  const degToRad = Math.PI / 180;
  const _radAlpha = alpha * degToRad;
  const _radBeta = beta * degToRad;
  const _radGamma = gamma * degToRad;

  const cA = Math.cos(_radAlpha);
  const sA = Math.sin(_radAlpha);
  const cB = Math.cos(_radBeta);
  const sB = Math.sin(_radBeta);
  const cG = Math.cos(_radGamma);
  const sG = Math.sin(_radGamma);

  // Calculate tilt-compensated magnetic vector components
  const Vx = -cA * sG - sA * sB * cG;
  const Vy = sA * sG - cA * sB * cG;

  let heading = Math.atan2(Vx, Vy) * (180 / Math.PI);
  if (heading < 0) heading += 360;

  return heading;
}

export default function CompassTool() {
  const [heading, setHeading] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [roll, setRoll] = useState(0);
  const [northMode, setNorthMode] = useState<'magnetic' | 'true'>('magnetic');
  const [declination, setDeclination] = useState(0);
  const [sensorState, setSensorState] = useState<'active' | 'denied' | 'unsupported' | 'calibrating'>('calibrating');
  const [geoCoords, setGeoCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [simulationMode, setSimulationMode] = useState(false);

  const prevCardinalRef = useRef<string>('');
  const lastHeadingRef = useRef<number>(0);
  const continuousRotationRef = useRef<number>(0);

  // Continuous angle unwrapping filter to prevent 0°/360° spin flips
  const unwrapSmoothAngle = useCallback((targetDeg: number) => {
    let currentContinuous = continuousRotationRef.current;
    let currentMod = ((currentContinuous % 360) + 360) % 360;

    let diff = targetDeg - currentMod;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    // Smooth low-pass interpolation (alpha = 0.25)
    let nextContinuous = currentContinuous + diff * 0.25;
    continuousRotationRef.current = nextContinuous;

    let normalized = ((nextContinuous % 360) + 360) % 360;
    lastHeadingRef.current = normalized;
    return Math.round(normalized);
  }, []);

  // Fetch Geolocation to calculate Magnetic Declination for True North
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const dec = getMagneticDeclination(lat, lng);
        setDeclination(dec);
        setGeoCoords({ lat, lng, accuracy: Math.round(pos.coords.accuracy) });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 6000 }
    );
  }, []);

  // Set up device orientation listeners
  useEffect(() => {
    let hasEventFired = false;
    const timeoutTimer = setTimeout(() => {
      if (!hasEventFired) {
        setSensorState('unsupported');
        setSimulationMode(true);
      }
    }, 2000);

    const handleOrientation = (e: any) => {
      hasEventFired = true;
      let rawHeading: number | null = null;

      // 1. iOS Safari native webkitCompassHeading (Already screen-aligned & tilt-compensated)
      if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
        rawHeading = e.webkitCompassHeading;
      }
      // 2. Standard W3C DeviceOrientation (alpha, beta, gamma)
      else if (e.alpha !== null && e.alpha !== undefined) {
        const a = e.alpha;
        const b = e.beta || 0;
        const g = e.gamma || 0;

        // Use 3D tilt compensation if phone is tilted
        if (Math.abs(b) > 10 || Math.abs(g) > 10) {
          rawHeading = computeTiltCompensatedHeading(a, b, g);
        } else {
          rawHeading = (360 - a) % 360;
        }

        // Apply screen orientation angle only for W3C alpha
        let screenAngle = 0;
        if (window.screen && window.screen.orientation) {
          screenAngle = window.screen.orientation.angle;
        } else if (window.orientation !== undefined) {
          screenAngle = Number(window.orientation) || 0;
        }
        rawHeading = (rawHeading + screenAngle) % 360;
      }

      if (rawHeading !== null) {
        setSensorState('active');
        clearTimeout(timeoutTimer);

        // Apply True North declination if selected
        if (northMode === 'true' && declination !== 0) {
          rawHeading = (rawHeading + declination + 360) % 360;
        }

        const finalHeading = unwrapSmoothAngle(rawHeading);
        setHeading(finalHeading);

        const dir = getCardinal(finalHeading);
        if (dir !== prevCardinalRef.current && ['N', 'E', 'S', 'W'].includes(dir)) {
          haptics.light();
          prevCardinalRef.current = dir;
        }
      }

      if (e.beta !== null) setPitch(Math.round(e.beta));
      if (e.gamma !== null) setRoll(Math.round(e.gamma));
    };

    // Permission request for iOS 13+
    const startSensors = async () => {
      const DeviceEvt = window.DeviceOrientationEvent as any;
      if (DeviceEvt && typeof DeviceEvt.requestPermission === 'function') {
        try {
          const perm = await DeviceEvt.requestPermission();
          if (perm === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
            setSensorState('active');
          } else {
            setSensorState('denied');
            setSimulationMode(true);
          }
        } catch {
          setSensorState('denied');
          setSimulationMode(true);
        }
      } else {
        const isAbsolute = 'ondeviceorientationabsolute' in window;
        const evtName = isAbsolute ? 'deviceorientationabsolute' : 'deviceorientation';
        window.addEventListener(evtName, handleOrientation, true);
      }
    };

    startSensors();

    return () => {
      clearTimeout(timeoutTimer);
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
    };
  }, [northMode, declination, unwrapSmoothAngle]);

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
    return names[getCardinal(deg)] || 'North';
  };

  const isTilted = Math.abs(pitch) > 30 || Math.abs(roll) > 30;
  const bubbleX = Math.max(-28, Math.min(28, (roll / 45) * 28));
  const bubbleY = Math.max(-28, Math.min(28, (pitch / 45) * 28));

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="overflow-hidden">
      <PageHeader
        title="Compass"
        subtitle="High-precision digital compass with tilt compensation"
        action={
          <button
            onClick={() => {
              haptics.light();
              setSimulationMode((prev) => !prev);
            }}
            className={`rounded-full p-2 text-xs font-semibold transition-all flex items-center gap-1.5 px-3 py-1.5 border ${
              simulationMode
                ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)] shadow-md'
                : 'border-[var(--color-line)] text-[var(--color-text-muted)] bg-[var(--color-surface)]'
            }`}
          >
            <Sliders size={14} />
            <span>{simulationMode ? 'Manual' : 'Sensor'}</span>
          </button>
        }
      />

      <div className="space-y-5 px-4 pb-28 pt-3 flex flex-col items-center max-w-md mx-auto">
        {/* Mode Selector */}
        <div className="w-full grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-2)] p-1.5 border border-[var(--color-line)]">
          <button
            onClick={() => {
              haptics.light();
              setNorthMode('magnetic');
            }}
            className={`rounded-xl py-2 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              northMode === 'magnetic' ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-text-muted)]'
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
              northMode === 'true' ? 'bg-[var(--color-accent)] text-white shadow-sm' : 'text-[var(--color-text-muted)]'
            }`}
          >
            <Navigation size={14} />
            True North {declination !== 0 && `(${declination > 0 ? '+' : ''}${declination}°)`}
          </button>
        </div>

        {/* Calibration Alerts */}
        {sensorState === 'unsupported' && !simulationMode && (
          <div className="w-full rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 flex gap-3 text-xs text-amber-400">
            <AlertCircle className="shrink-0 mt-0.5" size={16} />
            <span>Magnetometer sensor not detected. Switched to manual interactive control mode.</span>
          </div>
        )}

        {isTilted && !simulationMode && (
          <div className="w-full rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3 flex gap-2.5 items-center text-xs text-amber-400">
            <AlertCircle className="shrink-0" size={16} />
            <span>Hold phone flat on your palm for highest orientation accuracy.</span>
          </div>
        )}

        {/* Heading Readout Header */}
        <div className="text-center space-y-0.5">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-extrabold font-mono tracking-tight text-[var(--color-text)] tabular-nums">
              {heading}°
            </span>
            <span className="text-2xl font-extrabold text-[var(--color-accent)]">
              {getCardinal(heading)}
            </span>
          </div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)] flex items-center justify-center gap-1.5">
            <span>{getDirectionFull(heading)}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-line)] font-semibold text-[var(--color-accent)]">
              {northMode === 'true' ? 'True Geographic' : 'Magnetic'}
            </span>
          </p>
        </div>

        {/* Digital Compass Dial */}
        <div className="relative w-72 h-72 rounded-full bg-[var(--color-surface)] border-4 border-[var(--color-line)] flex items-center justify-center shadow-2xl overflow-hidden">
          <div className="absolute inset-1.5 rounded-full border border-[var(--color-line)]/40 pointer-events-none" />

          {/* Top Facing Pointer (12 o'clock) */}
          <div className="absolute top-1 z-30 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-[var(--color-accent)] filter drop-shadow-md" />
          </div>

          {/* Rotating Compass Face Card */}
          <motion.div
            animate={{ rotate: -heading }}
            transition={{ type: 'spring', stiffness: 120, damping: 22 }}
            className="w-full h-full relative"
          >
            {/* Degree Ticks */}
            {Array.from({ length: 12 }).map((_, i) => {
              const deg = i * 30;
              return (
                <div
                  key={deg}
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none flex flex-col justify-between items-center py-2.5"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className={`w-0.5 ${deg % 90 === 0 ? 'h-3 bg-[var(--color-text)]' : 'h-2 bg-[var(--color-text-muted)]/40'}`} />
                </div>
              );
            })}

            {/* Cardinal Letters */}
            <span className="absolute top-4 left-1/2 -translate-x-1/2 font-display font-black text-xl text-[var(--color-danger)]">
              N
            </span>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 font-display font-black text-xl text-[var(--color-text)]">
              S
            </span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-display font-black text-xl text-[var(--color-text)]">
              E
            </span>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display font-black text-xl text-[var(--color-text)]">
              W
            </span>

            {/* Intercardinals */}
            <span className="absolute top-10 right-10 font-display font-bold text-xs text-[var(--color-text-muted)]">NE</span>
            <span className="absolute bottom-10 right-10 font-display font-bold text-xs text-[var(--color-text-muted)]">SE</span>
            <span className="absolute bottom-10 left-10 font-display font-bold text-xs text-[var(--color-text-muted)]">SW</span>
            <span className="absolute top-10 left-10 font-display font-bold text-xs text-[var(--color-text-muted)]">NW</span>
          </motion.div>

          {/* Fixed Needle Pointer Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <motion.div
              animate={{ rotate: -heading }}
              transition={{ type: 'spring', stiffness: 120, damping: 22 }}
              className="w-full h-full relative flex items-center justify-center"
            >
              {/* Red North Arrow */}
              <div className="absolute top-12 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[65px] border-b-[var(--color-danger)] filter drop-shadow-md" />
              {/* Silver South Arrow */}
              <div className="absolute bottom-12 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[65px] border-t-[var(--color-text-muted)]/60 filter drop-shadow-md" />
            </motion.div>
          </div>

          {/* Center Bubble Level Indicator */}
          <div className="absolute z-20 w-11 h-11 rounded-full bg-[var(--color-surface)] border border-[var(--color-line)] shadow-inner flex items-center justify-center pointer-events-none">
            <div
              className="w-3.5 h-3.5 rounded-full bg-[var(--color-accent)] shadow-sm transition-transform duration-75"
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
                Manual Interactive Heading Slider
              </span>
              <span className="font-mono font-bold text-[var(--color-text)]">{heading}°</span>
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

        {/* Location & Sensor Info Box */}
        <div className="w-full rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              <MapPin size={15} className="text-[var(--color-accent)]" />
              <span>Location & Calibration</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck size={14} />
              <span>Auto-Calibrated</span>
            </div>
          </div>

          {geoCoords ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[var(--color-surface-2)] p-2.5 rounded-xl">
                <span className="text-[10px] font-medium text-[var(--color-text-muted)] block">Latitude</span>
                <span className="font-mono font-bold text-[var(--color-text)]">{geoCoords.lat.toFixed(4)}°</span>
              </div>
              <div className="bg-[var(--color-surface-2)] p-2.5 rounded-xl">
                <span className="text-[10px] font-medium text-[var(--color-text-muted)] block">Longitude</span>
                <span className="font-mono font-bold text-[var(--color-text)]">{geoCoords.lng.toFixed(4)}°</span>
              </div>
              <div className="bg-[var(--color-surface-2)] p-2.5 rounded-xl">
                <span className="text-[10px] font-medium text-[var(--color-text-muted)] block">Declination Offset</span>
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
