import { AdsConsent } from 'react-native-google-mobile-ads';

let pending: Promise<boolean> | null = null;
let lastAnswer = false;

// One UMP flow per process, shared by the banner and the interstitial so they never disagree.
export function ensureConsent(): Promise<boolean> {
  pending ??= gather();
  return pending;
}

export function canRequestAdsNow(): boolean {
  return lastAnswer;
}

async function gather(): Promise<boolean> {
  try {
    lastAnswer = (await AdsConsent.gatherConsent()).canRequestAds;
  } catch {
    pending = null;
    try {
      lastAnswer = (await AdsConsent.getConsentInfo()).canRequestAds;
    } catch {
      lastAnswer = false;
    }
  }
  return lastAnswer;
}
