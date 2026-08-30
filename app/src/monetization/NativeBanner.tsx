import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AdsConsent,
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { C } from '../ui/theme';
import { LOAD_MS, PaywallCard, SLOT_MIN, type PayProps } from './Fallback';
import { ADMOB_BANNER_UNIT_ID, ADS_USE_TEST_UNITS } from './runtime';

export function NativeBanner(props: PayProps) {
  const [consentOk, setConsentOk] = useState<boolean | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const info = await AdsConsent.gatherConsent();
        if (alive) setConsentOk(info.canRequestAds);
        if (alive && !info.canRequestAds) setFailed(true);
      } catch {
        if (alive) setConsentOk(true);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (loaded || failed || consentOk === false) return;
    const t = setTimeout(() => {
      if (!loaded) setFailed(true);
    }, LOAD_MS);
    return () => clearTimeout(t);
  }, [loaded, failed, consentOk]);

  const unitId =
    ADS_USE_TEST_UNITS || !ADMOB_BANNER_UNIT_ID
      ? TestIds.ADAPTIVE_BANNER
      : ADMOB_BANNER_UNIT_ID;
  const showBanner = consentOk !== false && !failed;

  return (
    <View style={styles.wrap}>
      {showBanner ? (
        <View style={loaded ? styles.bannerHost : styles.pendingBanner}>
          <BannerAd
            unitId={unitId}
            size={BannerAdSize.LARGE_ANCHORED_ADAPTIVE_BANNER}
            onAdLoaded={() => {
              setLoaded(true);
              setFailed(false);
            }}
            onAdFailedToLoad={() => setFailed(true)}
          />
        </View>
      ) : null}
      <PaywallCard {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 16, minHeight: SLOT_MIN },
  bannerHost: {
    overflow: 'hidden',
    borderRadius: 16,
    backgroundColor: C.line,
    alignItems: 'center',
  },
  pendingBanner: {
    position: 'absolute',
    opacity: 0.01,
    width: '100%',
    zIndex: 0,
  },
});
