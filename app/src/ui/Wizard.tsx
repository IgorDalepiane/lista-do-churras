import * as Clipboard from 'expo-clipboard';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calcularLista, equalPercents, rebalancePercents } from '../domain/calculate';
import { CUTS, HUNGER_LABEL, SIDE_DISPOSABLE, SIDE_FOOD, SIDES } from '../domain/catalog';
import {
  formatMoney,
  formatQty,
  groupItens,
  listaTexto,
  parseBrNumber,
  SECAO_LABEL,
  totalEstimado,
} from '../domain/format';
import type { CutId, Hunger, SideId } from '../domain/types';
import { AdSlot } from '../monetization/AdSlot';
import { useMonetization } from '../monetization/MonetizationProvider';
import {
  beer,
  bebemSub,
  corteSub,
  cta,
  hours,
  listaCopy,
  mesaGroups,
  mesaSub,
  people as peopleCopy,
  split,
  STEP_NAME,
  sub,
  titles,
} from './copy';
import { ItemIcon, PeopleIcon } from './icons';
import { Counter, Grid, GroupLabel, Radio, Screen, Segmented, SelectCard } from './kit';
import { ListaRow } from './ListaRow';
import { PrivacyPolicy } from './PrivacyPolicy';
import type { StepId } from './steps';
import { C, TILE } from './theme';

const HUNGER_OPTS = (['pouco', 'medio', 'muito'] as Hunger[]).map((id) => ({
  id,
  label: HUNGER_LABEL[id],
}));

const HOUR_PRESETS = [
  { h: 3, tag: 'Almoço' },
  { h: 4, tag: 'Tarde' },
  { h: 6, tag: 'Estica' },
  { h: 8, tag: 'Noite' },
  { h: 12, tag: 'Virada' },
];

export function Wizard() {
  const [homens, setHomens] = useState(6);
  const [mulheres, setMulheres] = useState(0);
  const [criancas, setCriancas] = useState(0);
  const [fomeHomem, setFomeHomem] = useState<Hunger>('medio');
  const [fomeMulher, setFomeMulher] = useState<Hunger>('medio');
  const [fomeCrianca, setFomeCrianca] = useState<Hunger>('medio');
  const [horas, setHoras] = useState(4);
  const [corteIds, setCorteIds] = useState<CutId[]>([]);
  const [percentuais, setPercentuais] = useState<Record<string, number>>({});
  const [acompanhamentoIds, setAcompanhamentoIds] = useState<SideId[]>([]);
  const [bebidaAlcoolica, setBebidaAlcoolica] = useState<boolean | null>(null);
  const [quantosBebem, setQuantosBebem] = useState(0);
  const [precos, setPrecos] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const monetization = useMonetization();

  const peopleCount = homens + mulheres + criancas;
  const adults = homens + mulheres;

  const steps = useMemo<StepId[]>(() => {
    const s: StepId[] = ['cortes', 'acompanhamentos', 'gente', 'fome', 'horas', 'bebida'];
    if (bebidaAlcoolica) s.push('bebem');
    if (corteIds.length >= 2) s.push('partilha');
    s.push('lista');
    return s;
  }, [bebidaAlcoolica, corteIds.length]);

  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const progress = (stepIndex + 1) / steps.length;

  const lista = useMemo(
    () =>
      calcularLista({
        homens,
        mulheres,
        criancas,
        fomeHomem,
        fomeMulher,
        fomeCrianca,
        horas,
        corteIds,
        percentuais,
        acompanhamentoIds,
        bebidaAlcoolica: Boolean(bebidaAlcoolica),
        quantosBebem: Math.min(quantosBebem, peopleCount),
      }),
    [
      homens,
      mulheres,
      criancas,
      fomeHomem,
      fomeMulher,
      fomeCrianca,
      horas,
      corteIds,
      percentuais,
      acompanhamentoIds,
      bebidaAlcoolica,
      quantosBebem,
      peopleCount,
    ],
  );

  const total = totalEstimado(lista, precos);
  const pricedCount = lista.ok ? lista.itens.filter((i) => parseBrNumber(precos[i.id] ?? '') != null).length : 0;

  function toggleCut(id: CutId) {
    setCorteIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      setPercentuais(equalPercents(next));
      return next;
    });
  }

  function toggleSide(id: SideId) {
    setAcompanhamentoIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function setPeople(kind: 'h' | 'm' | 'c', n: number) {
    const nextH = kind === 'h' ? n : homens;
    const nextM = kind === 'm' ? n : mulheres;
    const nextC = kind === 'c' ? n : criancas;
    if (kind === 'h') setHomens(n);
    if (kind === 'm') setMulheres(n);
    if (kind === 'c') setCriancas(n);
    setQuantosBebem((q) => Math.min(q, nextH + nextM + nextC));
  }

  function canContinue(): boolean {
    if (step === 'cortes') return corteIds.length > 0;
    if (step === 'gente') return peopleCount > 0;
    if (step === 'horas') return horas > 0;
    if (step === 'bebida') return bebidaAlcoolica !== null;
    if (step === 'bebem') return quantosBebem >= 0 && quantosBebem <= peopleCount;
    if (step === 'lista') return lista.ok;
    return true;
  }

  function next() {
    if (!canContinue()) return;
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    if (showPrivacy) {
      setShowPrivacy(false);
      return;
    }
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function copyLista() {
    await Clipboard.setStringAsync(listaTexto(lista, precos));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function ctaLabel(): string {
    if (step === 'acompanhamentos' && acompanhamentoIds.length === 0) return cta.skipMesa;
    if (steps[stepIndex + 1] === 'lista') return cta.seeLista;
    return cta.continue;
  }

  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          <Pressable
            style={styles.navCircle}
            onPress={back}
            disabled={stepIndex === 0}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={22} color={C.ink} style={stepIndex === 0 ? { opacity: 0.25 } : undefined} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
            </View>
            <Text style={styles.stepCaption}>
              {stepIndex + 1} de {steps.length} · {STEP_NAME[step]}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, step === 'lista' && styles.scrollLista]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {step === 'cortes' && (
            <Screen title={titles.cortes} sub={corteSub(corteIds.length)}>
              <Grid>
                {CUTS.map((c, i) => (
                  <SelectCard
                    key={c.id}
                    icon={<ItemIcon id={c.id} />}
                    label={c.nome}
                    tint={TILE[i % TILE.length]}
                    on={corteIds.includes(c.id)}
                    onPress={() => toggleCut(c.id)}
                  />
                ))}
              </Grid>
            </Screen>
          )}

          {step === 'acompanhamentos' && (
            <Screen title={titles.acompanhamentos} sub={mesaSub(acompanhamentoIds.length)}>
              <GroupLabel>{mesaGroups.food}</GroupLabel>
              <Grid>
                {SIDES.filter((s) => SIDE_FOOD.includes(s.id)).map((s, i) => (
                  <SelectCard
                    key={s.id}
                    icon={<ItemIcon id={s.id} />}
                    label={s.nome}
                    tint={TILE[i % TILE.length]}
                    on={acompanhamentoIds.includes(s.id)}
                    onPress={() => toggleSide(s.id)}
                  />
                ))}
              </Grid>
              <View style={{ height: 12 }} />
              <GroupLabel>{mesaGroups.disposable}</GroupLabel>
              <Grid>
                {SIDES.filter((s) => SIDE_DISPOSABLE.includes(s.id)).map((s, i) => (
                  <SelectCard
                    key={s.id}
                    icon={<ItemIcon id={s.id} />}
                    label={s.nome}
                    tint={TILE[(i + 2) % TILE.length]}
                    on={acompanhamentoIds.includes(s.id)}
                    onPress={() => toggleSide(s.id)}
                  />
                ))}
              </Grid>
            </Screen>
          )}

          {step === 'gente' && (
            <Screen title={titles.gente} sub={sub.gente}>
              <PeopleRow kind="h" label={peopleCopy.homens} value={homens} onChange={(n) => setPeople('h', n)} />
              <PeopleRow kind="m" label={peopleCopy.mulheres} value={mulheres} onChange={(n) => setPeople('m', n)} />
              <PeopleRow kind="c" label={peopleCopy.criancas} value={criancas} onChange={(n) => setPeople('c', n)} />
              <Text style={styles.liveTotal}>{peopleCopy.live(peopleCount)}</Text>
            </Screen>
          )}

          {step === 'fome' && (
            <Screen title={titles.fome} sub={sub.fome}>
              {homens > 0 && <HungerRow label={peopleCopy.homens} value={fomeHomem} onChange={setFomeHomem} />}
              {mulheres > 0 && <HungerRow label={peopleCopy.mulheres} value={fomeMulher} onChange={setFomeMulher} />}
              {criancas > 0 && <HungerRow label={peopleCopy.criancas} value={fomeCrianca} onChange={setFomeCrianca} />}
            </Screen>
          )}

          {step === 'horas' && (
            <Screen title={titles.horas} sub={sub.horas}>
              <View style={styles.presetRow}>
                {HOUR_PRESETS.map((p) => (
                  <Pressable
                    key={p.h}
                    onPress={() => setHoras(p.h)}
                    style={[styles.preset, horas === p.h && styles.presetOn]}
                  >
                    <Text style={[styles.presetH, horas === p.h && styles.presetOnTxt]}>{p.h} h</Text>
                    <Text style={[styles.presetTag, horas === p.h && styles.presetOnTxt]}>{p.tag}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.micro}>{hours.adjust}</Text>
              <Counter value={horas} onChange={setHoras} min={1} />
              {lista.ok ? (
                <View style={styles.preview}>
                  <Text style={styles.previewKicker}>{hours.about}</Text>
                  <Text style={styles.previewHero}>
                    {formatQty(lista.carneKg, 'kg')} {hours.ofMeat}
                  </Text>
                </View>
              ) : null}
            </Screen>
          )}

          {step === 'bebida' && (
            <Screen title={titles.bebida} sub={sub.bebida}>
              <Radio
                label={beer.yes}
                hint={beer.yesHint(peopleCount)}
                on={bebidaAlcoolica === true}
                onPress={() => {
                  setBebidaAlcoolica(true);
                  if (quantosBebem === 0) {
                    setQuantosBebem(Math.min(peopleCount, Math.max(1, adults)));
                  }
                }}
              />
              <Radio
                label={beer.no}
                hint={beer.noHint}
                on={bebidaAlcoolica === false}
                onPress={() => {
                  setBebidaAlcoolica(false);
                  setQuantosBebem(0);
                }}
              />
            </Screen>
          )}

          {step === 'bebem' && (
            <Screen title={titles.bebem} sub={bebemSub(peopleCount)}>
              <Counter value={quantosBebem} onChange={setQuantosBebem} min={0} max={peopleCount} />
              <Pressable onPress={() => setQuantosBebem(Math.min(peopleCount, adults))} style={styles.ghostLink}>
                <Text style={styles.link}>{peopleCopy.adultsOnly(adults)}</Text>
              </Pressable>
            </Screen>
          )}

          {step === 'partilha' && (
            <Screen title={titles.partilha} sub={sub.partilha}>
              {corteIds.map((id) => {
                const nome = CUTS.find((c) => c.id === id)?.nome ?? id;
                const pct = percentuais[id] ?? 0;
                const kg = lista.ok ? lista.itens.find((i) => i.id === id)?.quantidade : undefined;
                return (
                  <View key={id} style={styles.splitCard}>
                    <View style={styles.splitIcon}>
                      <ItemIcon id={id} size={22} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.splitName}>{nome}</Text>
                      {kg != null ? <Text style={styles.splitKg}>{formatQty(kg, 'kg')}</Text> : null}
                    </View>
                    <View style={styles.splitRow}>
                      <Pressable
                        style={styles.roundBtn}
                        onPress={() => setPercentuais(rebalancePercents(corteIds, percentuais, id, pct - 5))}
                      >
                        <Text style={styles.roundBtnTxt}>−</Text>
                      </Pressable>
                      <Text style={styles.splitPct}>{Math.round(pct)}%</Text>
                      <Pressable
                        style={styles.roundBtn}
                        onPress={() => setPercentuais(rebalancePercents(corteIds, percentuais, id, pct + 5))}
                      >
                        <Text style={styles.roundBtnTxt}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
              <Pressable onPress={() => setPercentuais(equalPercents(corteIds))} style={styles.ghostLink}>
                <Text style={styles.link}>{split.reset}</Text>
              </Pressable>
            </Screen>
          )}

          {step === 'lista' && (
            <Screen title={titles.lista} sub={sub.lista}>
              {!lista.ok ? (
                <Text style={styles.warn}>{lista.motivo}</Text>
              ) : (
                <>
                  <View style={styles.heroCard}>
                    <Text style={styles.heroKicker}>{listaCopy.heroKicker}</Text>
                    <Text style={styles.hero}>{formatQty(lista.carneKg, 'kg')}</Text>
                    <Text style={styles.heroSub}>{listaCopy.ofMeat}</Text>
                    <Text style={styles.heroMeta}>{listaCopy.meta(peopleCount, horas)}</Text>
                  </View>

                  {groupItens(lista.itens).map((g) => (
                    <View key={g.secao} style={styles.section}>
                      <Text style={styles.sectionTitle}>{SECAO_LABEL[g.secao]}</Text>
                      {g.itens.map((item) => (
                        <ListaRow
                          key={item.id}
                          item={item}
                          value={precos[item.id] ?? ''}
                          onChange={(t) => setPrecos((p) => ({ ...p, [item.id]: t }))}
                        />
                      ))}
                    </View>
                  ))}

                  {total > 0 ? (
                    <View style={styles.totalCard}>
                      <Text style={styles.totalKicker}>{listaCopy.pricedOf(pricedCount, lista.itens.length)}</Text>
                      <Text style={styles.total}>{listaCopy.total(formatMoney(total))}</Text>
                      <Text style={styles.totalHint}>{listaCopy.totalHint}</Text>
                    </View>
                  ) : (
                    <Text style={styles.microLeft}>{listaCopy.noPrices}</Text>
                  )}
                </>
              )}
              <AdSlot
                adsRemoved={monetization.adsRemoved}
                priceLabel={monetization.priceLabel}
                busy={monetization.busy}
                onRemoveAds={() => void monetization.removeAds()}
                onRestore={() => void monetization.restore()}
                onPrivacy={() => setShowPrivacy(true)}
              />
              <Pressable
                style={[styles.cta, styles.listaCopy, !canContinue() && styles.ctaOff]}
                onPress={copyLista}
                disabled={!canContinue()}
                accessibilityRole="button"
              >
                <Text style={styles.ctaTxt}>{copied ? cta.copied : cta.copy}</Text>
              </Pressable>
            </Screen>
          )}
        </ScrollView>

        {step !== 'lista' ? (
          <View style={styles.footer}>
            <Pressable
              style={[styles.cta, !canContinue() && styles.ctaOff]}
              onPress={next}
              disabled={!canContinue()}
            >
              <Text style={styles.ctaTxt}>{ctaLabel()}</Text>
            </Pressable>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PeopleRow({
  kind,
  label,
  value,
  onChange,
}: {
  kind: 'h' | 'm' | 'c';
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.peopleCard}>
      <View style={styles.peopleHead}>
        <View style={styles.peopleIcon}>
          <PeopleIcon kind={kind} size={22} />
        </View>
        <Text style={styles.peopleLabel}>{label}</Text>
      </View>
      <Counter value={value} onChange={onChange} min={0} />
    </View>
  );
}

function HungerRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Hunger;
  onChange: (h: Hunger) => void;
}) {
  return (
    <View style={styles.hungerCard}>
      <Text style={styles.peopleLabel}>{label}</Text>
      <Segmented options={HUNGER_OPTS} value={value} onChange={(id) => onChange(id as Hunger)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  navCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: C.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: { height: 6, borderRadius: 99, backgroundColor: C.line, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: C.accent, borderRadius: 99 },
  stepCaption: { color: C.muted, fontSize: 12, marginTop: 6, fontWeight: '600' },
  scroll: { paddingHorizontal: 20, paddingBottom: 28 },
  scrollLista: { paddingBottom: 48 },
  liveTotal: {
    marginTop: 8,
    textAlign: 'center',
    color: C.accent,
    fontWeight: '800',
    fontSize: 16,
  },
  peopleCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    gap: 10,
  },
  peopleHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  peopleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  peopleLabel: { color: C.ink, fontWeight: '700', fontSize: 16 },
  hungerCard: { marginBottom: 16 },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  preset: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: C.card,
    minWidth: 72,
    alignItems: 'center',
  },
  presetOn: { backgroundColor: C.ink },
  presetH: { color: C.ink, fontWeight: '800', fontSize: 16 },
  presetTag: { color: C.muted, fontSize: 11, marginTop: 2, fontWeight: '600' },
  presetOnTxt: { color: C.card },
  micro: { color: C.muted, marginBottom: 12, textAlign: 'center' },
  microLeft: { color: C.muted, marginTop: 8, lineHeight: 20 },
  preview: {
    marginTop: 24,
    backgroundColor: C.accentSoft,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
  },
  previewKicker: { color: C.accent, fontWeight: '700', fontSize: 12, letterSpacing: 0.6 },
  previewHero: { color: C.ink, fontSize: 22, fontWeight: '800', marginTop: 4 },
  splitCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  splitIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  splitName: { color: C.ink, fontWeight: '700', fontSize: 16 },
  splitKg: { color: C.muted, marginTop: 4, fontWeight: '600' },
  splitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  splitPct: { width: 52, textAlign: 'center', fontWeight: '800', fontSize: 18, color: C.ink },
  roundBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnTxt: { color: C.card, fontSize: 22, fontWeight: '600' },
  ghostLink: { paddingVertical: 12 },
  link: { color: C.accent, fontWeight: '700', textAlign: 'center' },
  heroCard: {
    backgroundColor: C.ink,
    borderRadius: 24,
    padding: 22,
    marginBottom: 8,
  },
  heroKicker: { color: '#E7E1D8', fontWeight: '700', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  hero: { color: C.card, fontSize: 40, fontWeight: '800', marginTop: 6, letterSpacing: -1 },
  heroSub: { color: '#C9C3BB', fontSize: 16, marginTop: 2 },
  heroMeta: { color: '#E7E1D8', marginTop: 14, fontWeight: '600' },
  section: { marginTop: 18 },
  sectionTitle: {
    color: C.muted,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  totalCard: {
    backgroundColor: C.accentSoft,
    borderRadius: 20,
    padding: 16,
    marginTop: 8,
  },
  totalKicker: { color: C.accent, fontWeight: '700', fontSize: 12 },
  total: { color: C.ink, fontSize: 22, fontWeight: '800', marginTop: 4 },
  totalHint: { color: C.muted, marginTop: 6, fontSize: 13, lineHeight: 18 },
  warn: { color: C.accent, fontSize: 16 },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  listaCopy: { marginTop: 28 },
  cta: {
    backgroundColor: C.ink,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaOff: { backgroundColor: C.ctaOff },
  ctaTxt: { color: C.card, fontWeight: '800', fontSize: 16 },
});
