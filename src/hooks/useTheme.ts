import { useEffect } from 'react';
import { useAppStore } from './useAppStore';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export function useTheme() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const apply = () => {
      const isLight =
        theme === 'light' || (theme === 'system' && !window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.body.classList.toggle('theme-light', isLight);
      document.documentElement.style.colorScheme = isLight ? 'light' : 'dark';

      // Dynamically configure native Android Status Bar
      if (Capacitor.isNativePlatform()) {
        StatusBar.setOverlaysWebView({ overlay: true })
          .then(() => {
            StatusBar.setStyle({ style: isLight ? Style.Light : Style.Dark });
          })
          .catch(() => {});
      }
    };
    apply();

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [theme]);
}
