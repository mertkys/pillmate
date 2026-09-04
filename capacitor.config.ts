import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pillmate.app',
  appName: 'PillMate',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
