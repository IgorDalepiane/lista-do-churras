import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { adsCopy } from '../ui/copy';
import { IapBridge } from './IapBridge';
import { loadAdsRemoved, saveAdsRemoved } from './entitlement';

type Actions = {
  purchase: () => Promise<void>;
  restore: () => Promise<void>;
};

type Monetization = {
  adsRemoved: boolean;
  priceLabel: string;
  busy: boolean;
  removeAds: () => Promise<void>;
  restore: () => Promise<void>;
};

const Ctx = createContext<Monetization | null>(null);

export function useMonetization(): Monetization {
  const v = useContext(Ctx);
  if (!v) {
    return {
      adsRemoved: false,
      priceLabel: adsCopy.defaultPrice,
      busy: false,
      removeAds: async () => {},
      restore: async () => {},
    };
  }
  return v;
}

export function MonetizationProvider({ children }: { children: ReactNode }) {
  const [adsRemoved, setAdsRemoved] = useState(false);
  const [priceLabel, setPriceLabel] = useState(adsCopy.defaultPrice);
  const [busy, setBusy] = useState(false);
  const actions = useRef<Actions>({
    purchase: async () => {},
    restore: async () => {},
  });

  useEffect(() => {
    loadAdsRemoved().then(setAdsRemoved);
  }, []);

  const grant = useCallback(async () => {
    setAdsRemoved(true);
    await saveAdsRemoved(true);
  }, []);

  const register = useCallback((next: Actions) => {
    actions.current = next;
  }, []);

  const removeAds = useCallback(async () => {
    if (adsRemoved) return;
    setBusy(true);
    try {
      await actions.current.purchase();
    } finally {
      setBusy(false);
    }
  }, [adsRemoved]);

  const restore = useCallback(async () => {
    setBusy(true);
    try {
      await actions.current.restore();
    } finally {
      setBusy(false);
    }
  }, []);

  const value = useMemo(
    () => ({ adsRemoved, priceLabel, busy, removeAds, restore }),
    [adsRemoved, priceLabel, busy, removeAds, restore],
  );

  return (
    <Ctx.Provider value={value}>
      <IapBridge grant={grant} setPriceLabel={setPriceLabel} register={register} />
      {children}
    </Ctx.Provider>
  );
}
