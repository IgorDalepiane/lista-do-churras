import assert from 'node:assert/strict';
import { test } from 'node:test';
import { decideListAd, INITIAL_LIST_AD_MEMORY, type ListAdFacts, type ListAdMemory } from './listAdPolicy';

const ready: ListAdFacts = { adsRemoved: false, canRequestAds: true, adLoaded: true };

function requests(facts: ListAdFacts[]): boolean[] {
  let memory: ListAdMemory = INITIAL_LIST_AD_MEMORY;
  return facts.map((f) => {
    const d = decideListAd(memory, f);
    memory = d.memory;
    return d.showAd;
  });
}

test('o primeiro pedido da lista nunca mostra anúncio', () => {
  assert.equal(decideListAd(INITIAL_LIST_AD_MEMORY, ready).showAd, false);
});

test('o segundo pedido mostra o anúncio carregado e o terceiro não', () => {
  assert.deepEqual(requests([ready, ready, ready]), [false, true, false]);
});

test('quem removeu anúncios nunca vê nem carrega anúncio', () => {
  const paid = { ...ready, adsRemoved: true, adLoaded: false };
  let memory: ListAdMemory = INITIAL_LIST_AD_MEMORY;
  for (let i = 0; i < 3; i++) {
    const d = decideListAd(memory, paid);
    assert.equal(d.showAd, false);
    assert.equal(d.preload, false);
    memory = d.memory;
  }
});

test('sem consentimento nunca mostra', () => {
  const noConsent = { ...ready, canRequestAds: false };
  assert.deepEqual(requests([noConsent, noConsent, noConsent]), [false, false, false]);
});

test('segundo pedido sem anúncio carregado abre a lista e carrega; um pedido depois ainda pode mostrar', () => {
  const first = decideListAd(INITIAL_LIST_AD_MEMORY, { ...ready, adLoaded: false });
  assert.equal(first.preload, true);
  const second = decideListAd(first.memory, { ...ready, adLoaded: false });
  assert.equal(second.showAd, false);
  assert.equal(second.preload, true);
  const third = decideListAd(second.memory, ready);
  assert.equal(third.showAd, true);
  assert.equal(third.preload, false);
});
