import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b5776ddb68cf4be8ab3a7e7326790308',
  appName: 'Bingo Ethio',
  webDir: 'dist',
  server: {
    url: 'https://b5776ddb-68cf-4be8-ab3a-7e7326790308.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#1a1a2e',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'Bingo Ethio',
  },
  android: {
    backgroundColor: '#1a1a2e',
  },
};

export default config;
