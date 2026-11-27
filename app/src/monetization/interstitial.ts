import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { canRequestAdsNow, ensureConsent } from './consent';
import { decideListAd, INITIAL_LIST_AD_MEMORY, type ListAdMemory } from './listAdPolicy';
import { ADMOB_INTERSTITIAL_UNIT_ID, ADS_USE_TEST_UNITS } from './runtime';

// The Android module emits nothing when the SDK refuses to show, so a show that never opens
// must still reveal the list.
const SHOW_OPEN_TIMEOUT_MS = 2000;

let memory: ListAdMemory = INITIAL_LIST_AD_MEMORY;
let ad: InterstitialAd | null = null;

export function beforeList(adsRemoved: boolean): Promise<void> {
  const d = decideListAd(memory, { adsRemoved, canRequestAds: canRequestAdsNow(), adLoaded: ad?.loaded ?? false });
  memory = d.memory;
  if (d.preload) {
    void ensureConsent().then((ok) => {
      if (ok) getAd().load();
    });
  }
  if (!d.showAd) return Promise.resolve();
  const shown = getAd();
  return new Promise((resolve) => {
    const openTimer = setTimeout(resolve, SHOW_OPEN_TIMEOUT_MS);
    shown.addAdEventListener(AdEventType.OPENED, () => clearTimeout(openTimer));
    shown.addAdEventListener(AdEventType.CLOSED, () => resolve());
    shown.addAdEventListener(AdEventType.ERROR, () => resolve());
    shown.show().catch(() => resolve());
  });
}

function getAd(): InterstitialAd {
  ad ??= InterstitialAd.createForAdRequest(
    ADS_USE_TEST_UNITS || !ADMOB_INTERSTITIAL_UNIT_ID ? TestIds.INTERSTITIAL : ADMOB_INTERSTITIAL_UNIT_ID,
  );
  return ad;
}
