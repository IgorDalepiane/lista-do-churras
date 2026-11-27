import { AdEventType, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import { canRequestAdsNow, ensureConsent } from './consent';
import { decideListAd, INITIAL_LIST_AD_MEMORY, type ListAdMemory } from './listAdPolicy';
import { ADMOB_INTERSTITIAL_UNIT_ID, ADS_USE_TEST_UNITS } from './runtime';

// The Android module emits nothing when the SDK refuses to show, so a show that never opens
// must still reveal the list.
const SHOW_OPEN_TIMEOUT_MS = 2000;

let memory: ListAdMemory = INITIAL_LIST_AD_MEMORY;
let ad: InterstitialAd | null = null;
let pendingReveal: (() => void) | null = null;
let openTimer: ReturnType<typeof setTimeout> | null = null;

// Calls `reveal` exactly once: right away when no ad shows, otherwise after the ad closes or
// fails. Revealing under the ad would mount the banner behind it.
export function beforeList(adsRemoved: boolean, reveal: () => void): void {
  const d = decideListAd(memory, { adsRemoved, canRequestAds: canRequestAdsNow(), adLoaded: ad?.loaded ?? false });
  memory = d.memory;
  if (d.preload) {
    void ensureConsent().then((ok) => {
      if (ok) getAd().load();
    });
  }
  if (!d.showAd) {
    reveal();
    return;
  }
  pendingReveal = reveal;
  openTimer = setTimeout(flushReveal, SHOW_OPEN_TIMEOUT_MS);
  try {
    getAd().show().catch(flushReveal);
  } catch {
    flushReveal();
  }
}

function getAd(): InterstitialAd {
  if (ad) return ad;
  const unitId = ADS_USE_TEST_UNITS || !ADMOB_INTERSTITIAL_UNIT_ID ? TestIds.INTERSTITIAL : ADMOB_INTERSTITIAL_UNIT_ID;
  const created = InterstitialAd.createForAdRequest(unitId);
  created.addAdEventListener(AdEventType.OPENED, clearOpenTimer);
  created.addAdEventListener(AdEventType.CLOSED, flushReveal);
  created.addAdEventListener(AdEventType.ERROR, flushReveal);
  ad = created;
  return created;
}

function clearOpenTimer(): void {
  if (openTimer) clearTimeout(openTimer);
  openTimer = null;
}

function flushReveal(): void {
  clearOpenTimer();
  const r = pendingReveal;
  pendingReveal = null;
  r?.();
}
