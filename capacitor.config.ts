import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.calcverse.app',
  appName: 'ToolVerse',
  webDir: 'dist',
  backgroundColor: '#060d23',
  android: {
    backgroundColor: '#060d23',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 900,
      backgroundColor: '#060d23',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#060d23',
    },
  },
};

export default config;
