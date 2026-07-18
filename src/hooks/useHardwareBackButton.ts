import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { snackbar } from '@/components/ui/Snackbar';

export function useHardwareBackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastPressRef = useRef<number>(0);

  useEffect(() => {
    // Only intercept back button on native mobile platforms (Android)
    if (!Capacitor.isNativePlatform()) return;

    const handleBackButton = async () => {
      // 1. Dispatch custom event to check if any bottom sheet/overlay is open
      const event = new CustomEvent('capacitorBackButton', { cancelable: true });
      document.dispatchEvent(event);

      // If event.defaultPrevented is true, a modal/sheet closed itself
      if (event.defaultPrevented) {
        return;
      }

      // 2. Navigation / Exit check
      const isRoot = location.pathname === '/';

      if (!isRoot) {
        // Navigate back in history
        navigate(-1);
      } else {
        // Double-press back button to exit app from the home page
        const now = Date.now();
        if (now - lastPressRef.current < 2000) {
          App.exitApp();
        } else {
          lastPressRef.current = now;
          snackbar('Press back again to exit');
        }
      }
    };

    // Register Capacitor back button listener
    const listenerPromise = App.addListener('backButton', handleBackButton);

    return () => {
      listenerPromise.then((handle) => handle.remove());
    };
  }, [location.pathname, navigate]);
}
