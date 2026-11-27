// Process lifetime: a cold start (or an OTA reload) starts over at INITIAL_LIST_AD_MEMORY.
export type ListAdMemory = {
  readonly listRequests: number;
  readonly adShown: boolean;
};

export const INITIAL_LIST_AD_MEMORY: ListAdMemory = { listRequests: 0, adShown: false };

export type ListAdFacts = {
  readonly adsRemoved: boolean;
  readonly canRequestAds: boolean;
  readonly adLoaded: boolean;
};

export type ListAdDecision = {
  readonly memory: ListAdMemory;
  readonly showAd: boolean;
  readonly preload: boolean;
};

export function decideListAd(memory: ListAdMemory, facts: ListAdFacts): ListAdDecision {
  const showAd =
    memory.listRequests >= 1 && !memory.adShown && !facts.adsRemoved && facts.canRequestAds && facts.adLoaded;
  const adShown = memory.adShown || showAd;
  return {
    memory: { listRequests: memory.listRequests + 1, adShown },
    showAd,
    preload: !adShown && !facts.adsRemoved && !facts.adLoaded,
  };
}
