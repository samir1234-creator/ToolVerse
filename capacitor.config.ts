import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.calcverse.app',
  appName: 'ToolVerse',
  webDir: 'dist',
  backgroundColor: '#0E0F13',
  android: {
    backgroundColor: '#0E0F13',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 900,
      backgroundColor: '#0E0F13',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0E0F13',
    },
  },
};

export default config;
