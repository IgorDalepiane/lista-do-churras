import type { ExpoConfig } from 'expo/config';

import packageJson from './package.json';

const projectId = '3e4a9a0c-d076-4c69-8ae9-328888a850ef';

/** Google sample App IDs — public docs, not a publisher account. */
const ADMOB_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const ADMOB_IOS_APP_ID = 'ca-app-pub-3940256099942544~1458002511';
const ADMOB_BANNER_UNIT_ID = '';
const ADS_USE_TEST_UNITS = true;
const IAP_PRODUCT_ID = 'lista_sem_anuncio';

const config: ExpoConfig = {
  name: 'Lista do Churras',
  slug: 'lista-do-churras',
  version: packageJson.version,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  backgroundColor: '#F3EEE6',
  owner: 'dandf',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.listadochurras.app',
  },
  android: {
    package: 'com.listadochurras.app',
    backgroundColor: '#F3EEE6',
    adaptiveIcon: {
      backgroundColor: '#F3EEE6',
      backgroundImage: './assets/android-icon-background.png',
      foregroundImage: './assets/android-icon-foreground.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
    output: 'single',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#F3EEE6',
        dark: {
          image: './assets/splash-icon-dark.png',
          backgroundColor: '#3E372F',
        },
      },
    ],
    'expo-font',
    'expo-secure-store',
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '2.3.20',
          extraProguardRules:
            '-keep class com.google.android.gms.internal.consent_sdk.** { *; }',
        },
      },
    ],
    [
      './plugins/withKotlinGradlePlugin',
      {
        kotlinVersion: '2.3.20',
      },
    ],
    'expo-iap',
    'expo-updates',
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: ADMOB_ANDROID_APP_ID,
        iosAppId: ADMOB_IOS_APP_ID,
      },
    ],
  ],
  extra: {
    eas: {
      projectId,
    },
    iapProductId: IAP_PRODUCT_ID,
    admobBannerUnitId: ADMOB_BANNER_UNIT_ID,
    adsUseTestUnits: ADS_USE_TEST_UNITS,
  },
  // Concrete string so `eas update` can resolve it without a checked-in android/ tree.
  // Same rule as runtimeVersion.policy = appVersion: bump `version` in package.json when native changes.
  runtimeVersion: packageJson.version,
  updates: {
    url: `https://u.expo.dev/${projectId}`,
  },
};

export default config;
