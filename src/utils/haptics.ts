import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

let enabled = true;

export function setHapticsEnabled(v: boolean) {
  enabled = v;
}

async function fire(style: ImpactStyle) {
  if (!enabled) return;
  try {
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style });
    } else if (navigator.vibrate) {
      navigator.vibrate(style === ImpactStyle.Heavy ? 25 : style === ImpactStyle.Medium ? 15 : 8);
    }
  } catch {
    // no-op, haptics unsupported
  }
}

export const haptics = {
  light: () => fire(ImpactStyle.Light),
  medium: () => fire(ImpactStyle.Medium),
  heavy: () => fire(ImpactStyle.Heavy),
};
