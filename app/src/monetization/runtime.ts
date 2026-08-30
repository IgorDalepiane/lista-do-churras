import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra as Record<string, unknown> | undefined;

function extraString(key: string): string | undefined {
  const value = extra?.[key];
  return typeof value === 'string' ? value : undefined;
}

export const IAP_PRODUCT_ID = extraString('iapProductId') ?? 'lista_sem_anuncio';

export const ADMOB_BANNER_UNIT_ID = extraString('admobBannerUnitId') ?? '';

export const ADS_USE_TEST_UNITS = extra?.adsUseTestUnits !== false;
