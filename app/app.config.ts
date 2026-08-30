import type { ConfigContext, ExpoConfig } from 'expo/config';

const TEST_ANDROID_APP_ID = 'ca-app-pub-3940256099942544~3347511713';
const TEST_IOS_APP_ID = 'ca-app-pub-3940256099942544~1458002511';

function nonEmpty(value: string | undefined): value is string {
  return Boolean(value?.trim());
}

export default ({ config }: ConfigContext): ExpoConfig => {
  // Invertase reads this key from the app.json file; it is not part of ExpoConfig.
  const { ['react-native-google-mobile-ads']: _admobJson, ...expoConfig } = config as ExpoConfig & {
    'react-native-google-mobile-ads'?: unknown;
  };

  const liveAds =
    process.env.EAS_BUILD_PROFILE === 'production' &&
    nonEmpty(process.env.ADMOB_ANDROID_APP_ID) &&
    nonEmpty(process.env.ADMOB_IOS_APP_ID) &&
    nonEmpty(process.env.ADMOB_BANNER_UNIT_ID);

  const androidAppId = liveAds
    ? process.env.ADMOB_ANDROID_APP_ID!.trim()
    : TEST_ANDROID_APP_ID;
  const iosAppId = liveAds ? process.env.ADMOB_IOS_APP_ID!.trim() : TEST_IOS_APP_ID;
  const bannerUnitId = liveAds ? process.env.ADMOB_BANNER_UNIT_ID!.trim() : '';

  const plugins = (expoConfig.plugins ?? []).map((plugin) => {
    if (Array.isArray(plugin) && plugin[0] === 'react-native-google-mobile-ads') {
      const options = plugin[1] && typeof plugin[1] === 'object' ? plugin[1] : {};
      return [
        'react-native-google-mobile-ads',
        { ...options, androidAppId, iosAppId },
      ];
    }
    return plugin;
  });

  return {
    ...expoConfig,
    name: expoConfig.name ?? 'Lista do Churras',
    slug: expoConfig.slug ?? 'lista-do-churras',
    plugins,
    extra: {
      ...expoConfig.extra,
      iapProductId: expoConfig.extra?.iapProductId ?? 'lista_sem_anuncio',
      admobBannerUnitId: bannerUnitId,
      adsUseTestUnits: !liveAds,
    },
  };
};
