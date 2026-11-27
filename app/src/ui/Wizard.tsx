import * as Clipboard from 'expo-clipboard';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { calcularLista, equalPercents, rebalancePercents } from '../domain/calculate';
import { CUTS, HUNGER_LABEL, SIDES } from '../domain/catalog';
import { formatQty, groupItens, listaTexto, SECAO_LABEL } from '../domain/format';
import type { CutId, Hunger, SideId } from '../domain/types';
import { canAdvance, INITIAL_WIZARD, reconcile, stepsFor, toChurrascoInput, type WizardAnswers } from '../domain/wizard';
import { AdSlot } from '../monetization/AdSlot';
import { useMonetization } from '../monetization/MonetizationProvider';
import { beer, cta, hours, listaCopy, people as peopleCopy, restartCopy, split, STEP_NAME, titles } from './copy';
import { ItemIcon, PeopleIcon } from './icons';
import {
  Checkbox,
  Counter,
  CtaPressable,
  Grid,
  GroupLabel,
  PressScale,
  Radio,
  Screen,
  Segmented,
  SelectCard,
} from './kit';
import { ListaRow } from './ListaRow';
import {
  easeOut,
  enterAppear,
  enterHero,
  enterStepBack,
  enterStepForward,
  stepMs,
  useReduceMotion,
} from './motion';
import { PrivacyPolicy } from './PrivacyPolicy';
import { loadProgress, saveProgress } from './progress';
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
  const [wizard, setWizard] = useState(loadProgress);
  useEffect(() => saveProgress(wizard), [wizard]);
  const { answers: a, step } = wizard;
  const [copied, setCopied] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const scrollRef = useRef<ScrollView>(null);
  const reduceMotion = useReduceMotion();
  const monetization = useMonetization();
  const copySticky = monetization.adsRemoved;

  const peopleCount = a.homens + a.mulheres + a.criancas;
  const adults = a.homens + a.mulheres;

  const steps = stepsFor(a);
  const stepIndex = steps.indexOf(step);
  const progress = (stepIndex + 1) / steps.length;
  const stepEntering = reduceMotion ? undefined : direction === 'forward' ? enterStepForward : enterStepBack;

  const lista = useMemo(() => calcularLista(toChurrascoInput(a)), [a]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, [step]);

  const edit = (patch: Partial<WizardAnswers> | ((a: WizardAnswers) => Partial<WizardAnswers>)) =>
    setWizard((w) => ({
      ...w,
      answers: reconcile({ ...w.answers, ...(typeof patch === 'function' ? patch(w.answers) : patch) }),
    }));

  function toggleCut(id: CutId) {
    edit((a) => {
      const corteIds = a.corteIds.includes(id) ? a.corteIds.filter((x) => x !== id) : [...a.corteIds, id];
      return { corteIds, percentuais: equalPercents(corteIds) };
    });
  }

  function toggleSide(id: SideId) {
    edit((a) => ({
      acompanhamentoIds: a.acompanhamentoIds.includes(id)
        ? a.acompanhamentoIds.filter((x) => x !== id)
        : [...a.acompanhamentoIds, id],
    }));
  }

  function canContinue(): boolean {
    return step === 'lista' ? lista.ok : canAdvance(step, a);
  }

  function next() {
    if (!canContinue()) return;
    setDirection('forward');
    setWizard((w) => {
      const s = stepsFor(w.answers);
      return { ...w, step: s[Math.min(s.indexOf(w.step) + 1, s.length - 1)] };
    });
  }

  function restart() {
    Alert.alert(restartCopy.title, restartCopy.body, [
      { text: restartCopy.cancel, style: 'cancel' },
      {
        text: restartCopy.confirm,
        style: 'destructive',
        onPress: () => {
          setDirection('back');
          setWizard(INITIAL_WIZARD);
        },
      },
    ]);
  }

  const back = useCallback(() => {
    if (showPrivacy) {
      setShowPrivacy(false);
      return;
    }
    setDirection('back');
    setWizard((w) => {
      const s = stepsFor(w.answers);
      return { ...w, step: s[Math.max(s.indexOf(w.step) - 1, 0)] };
    });
  }, [showPrivacy]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (Keyboard.isVisible()) {
        Keyboard.dismiss();
        return true;
      }
      if (showPrivacy || stepIndex > 0) {
        back();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [back, showPrivacy, stepIndex]);

  async function copyLista() {
    await Clipboard.setStringAsync(listaTexto(lista));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function ctaLabel(): string {
    if (step === 'acompanhamentos' && a.acompanhamentoIds.length === 0) return cta.skipMesa;
    if (steps[stepIndex + 1] === 'lista') return cta.seeLista;
    return cta.continue;
  }

  if (showPrivacy) {
    return <PrivacyPolicy onBack={() => setShowPrivacy(false)} />;
  }

  const restartLink = (
    <PressScale haptic="selection" onPress={restart} style={styles.ghostLink} accessibilityRole="button">
      <Text style={styles.link}>{cta.startOver}</Text>
    </PressScale>
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.top}>
          <PressScale
            style={styles.navCircle}
            onPress={back}
            disabled={stepIndex === 0}
            haptic="selection"
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <Ionicons name="arrow-back" size={22} color={C.ink} style={stepIndex === 0 ? { opacity: 0.25 } : undefined} />
          </PressScale>
          <View style={{ flex: 1 }}>
            <View style={styles.progressTrack}>
              <ProgressFill progress={progress} reduceMotion={reduceMotion} />
            </View>
            <Text style={styles.stepCaption}>
              {stepIndex + 1} de {steps.length} · {STEP_NAME[step]}
            </Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.scroll, step === 'lista' && !copySticky && styles.scrollLista]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Animated.View key={`${stepIndex}-${step}`} entering={stepEntering}>
            {step === 'cortes' && (
              <Screen title={titles.cortes}>
                <Grid>
                  {CUTS.map((c, i) => (
                    <SelectCard
                      key={c.id}
                      icon={<ItemIcon id={c.id} />}
                      label={c.nome}
                      tint={TILE[i % TILE.length]}
                      on={a.corteIds.includes(c.id)}
                      onPress={() => toggleCut(c.id)}
                    />
                  ))}
                </Grid>
              </Screen>
            )}

            {step === 'acompanhamentos' && (
              <Screen title={titles.acompanhamentos}>
                <Grid>
                  {SIDES.map((s, i) => (
                    <SelectCard
                      key={s.id}
                      icon={<ItemIcon id={s.id} />}
                      label={s.nome}
                      tint={TILE[i % TILE.length]}
                      on={a.acompanhamentoIds.includes(s.id)}
                      onPress={() => toggleSide(s.id)}
                    />
                  ))}
                </Grid>
              </Screen>
            )}

            {step === 'gente' && (
              <Screen title={titles.gente}>
                <PeopleRow kind="h" label={peopleCopy.homens} value={a.homens} onChange={(n) => edit({ homens: n })} />
                <PeopleRow kind="m" label={peopleCopy.mulheres} value={a.mulheres} onChange={(n) => edit({ mulheres: n })} />
                <PeopleRow kind="c" label={peopleCopy.criancas} value={a.criancas} onChange={(n) => edit({ criancas: n })} />
                <Text style={styles.liveTotal}>{peopleCopy.live(peopleCount)}</Text>
              </Screen>
            )}

            {step === 'fome' && (
              <Screen title={titles.fome}>
                {a.homens > 0 && (
                  <HungerRow label={peopleCopy.homens} value={a.fomeHomem} onChange={(h) => edit({ fomeHomem: h })} />
                )}
                {a.mulheres > 0 && (
                  <HungerRow label={peopleCopy.mulheres} value={a.fomeMulher} onChange={(h) => edit({ fomeMulher: h })} />
                )}
                {a.criancas > 0 && (
                  <HungerRow label={peopleCopy.criancas} value={a.fomeCrianca} onChange={(h) => edit({ fomeCrianca: h })} />
                )}
              </Screen>
            )}

            {step === 'horas' && (
              <Screen title={titles.horas}>
                <View style={styles.presetRow}>
                  {HOUR_PRESETS.map((p) => (
                    <PressScale
                      key={p.h}
                      haptic="selection"
                      onPress={() => edit({ horas: p.h })}
                      style={[styles.preset, a.horas === p.h && styles.presetOn]}
                    >
                      <Text style={[styles.presetH, a.horas === p.h && styles.presetOnTxt]}>{p.h} h</Text>
                      <Text style={[styles.presetTag, a.horas === p.h && styles.presetOnTxt]}>{p.tag}</Text>
                    </PressScale>
                  ))}
                </View>
                <Text style={styles.micro}>{hours.adjust}</Text>
                <Counter value={a.horas} onChange={(n) => edit({ horas: n })} min={1} max={12} />
                {lista.ok ? (
                  <Animated.View entering={reduceMotion ? undefined : enterAppear} style={styles.preview}>
                    <Text style={styles.previewKicker}>{hours.about}</Text>
                    <Text style={styles.previewHero}>
                      {formatQty(lista.carneKg, 'kg')} {hours.ofMeat}
                    </Text>
                  </Animated.View>
                ) : null}
              </Screen>
            )}

            {step === 'bebida' && (
              <Screen title={titles.bebida}>
                <Radio
                  label={beer.yes}
                  on={a.bebidaAlcoolica === true}
                  onPress={() =>
                    edit({
                      bebidaAlcoolica: true,
                      quantosBebem: a.quantosBebem === 0 ? Math.min(peopleCount, Math.max(1, adults)) : a.quantosBebem,
                    })
                  }
                />
                <Radio
                  label={beer.no}
                  on={a.bebidaAlcoolica === false}
                  onPress={() => edit({ bebidaAlcoolica: false })}
                />
                <View style={{ height: 12 }} />
                <GroupLabel>{beer.extra}</GroupLabel>
                <Checkbox
                  label={beer.soda}
                  on={a.incluirRefrigerante}
                  onPress={() => edit((a) => ({ incluirRefrigerante: !a.incluirRefrigerante }))}
                />
                <Checkbox label={beer.water} on={a.incluirAgua} onPress={() => edit((a) => ({ incluirAgua: !a.incluirAgua }))} />
              </Screen>
            )}

            {step === 'bebem' && (
              <Screen title={titles.bebem}>
                <Counter value={a.quantosBebem} onChange={(n) => edit({ quantosBebem: n })} min={0} max={peopleCount} />
              </Screen>
            )}

            {step === 'partilha' && (
              <Screen title={titles.partilha} sub={lista.ok ? split.total(formatQty(lista.carneKg, 'kg')) : undefined}>
                {a.corteIds.map((id) => {
                  const nome = CUTS.find((c) => c.id === id)?.nome ?? id;
                  const pct = a.percentuais[id] ?? 0;
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
                        <PressScale
                          haptic="light"
                          style={styles.roundBtn}
                          onPress={() => edit({ percentuais: rebalancePercents(a.corteIds, a.percentuais, id, pct - 5) })}
                        >
                          <Text style={styles.roundBtnTxt}>−</Text>
                        </PressScale>
                        <Text style={styles.splitPct}>{Math.round(pct)}%</Text>
                        <PressScale
                          haptic="light"
                          style={styles.roundBtn}
                          onPress={() => edit({ percentuais: rebalancePercents(a.corteIds, a.percentuais, id, pct + 5) })}
                        >
                          <Text style={styles.roundBtnTxt}>+</Text>
                        </PressScale>
                      </View>
                    </View>
                  );
                })}
                <PressScale
                  haptic="selection"
                  onPress={() => edit({ percentuais: equalPercents(a.corteIds) })}
                  style={styles.ghostLink}
                >
                  <Text style={styles.link}>{split.reset}</Text>
                </PressScale>
              </Screen>
            )}

            {step === 'lista' && (
              <Screen title={titles.lista}>
                {!lista.ok ? (
                  <Text style={styles.warn}>{lista.motivo}</Text>
                ) : (
                  <>
                    <Animated.View entering={reduceMotion ? undefined : enterHero} style={styles.heroCard}>
                      <Text style={styles.heroKicker}>{listaCopy.heroKicker}</Text>
                      <Text style={styles.hero}>{formatQty(lista.carneKg, 'kg')}</Text>
                      <Text style={styles.heroSub}>{listaCopy.ofMeat}</Text>
                      <Text style={styles.heroMeta}>{listaCopy.meta(peopleCount, a.horas)}</Text>
                    </Animated.View>

                    {groupItens(lista.itens).map((g) => (
                      <View key={g.secao} style={styles.section}>
                        <Text style={styles.sectionTitle}>{SECAO_LABEL[g.secao]}</Text>
                        {g.itens.map((item) => (
                          <ListaRow key={item.id} item={item} />
                        ))}
                      </View>
                    ))}
                  </>
                )}
                {!copySticky ? (
                  <>
                    <AdSlot
                      adsRemoved={monetization.adsRemoved}
                      priceLabel={monetization.priceLabel}
                      busy={monetization.busy}
                      onRemoveAds={() => void monetization.removeAds()}
                      onRestore={() => void monetization.restore()}
                      onPrivacy={() => setShowPrivacy(true)}
                    />
                    <CtaPressable
                      enabled={canContinue()}
                      success={copied}
                      haptic="success"
                      onPress={copyLista}
                      style={[styles.cta, styles.listaCopy]}
                      accessibilityRole="button"
                    >
                      <Text style={styles.ctaTxt}>{copied ? cta.copied : cta.copy}</Text>
                    </CtaPressable>
                    {restartLink}
                  </>
                ) : null}
              </Screen>
            )}
          </Animated.View>
        </ScrollView>

        {step !== 'lista' || copySticky ? (
          <View style={styles.footer}>
            {step === 'lista' ? (
              <>
                <CtaPressable
                  enabled={canContinue()}
                  success={copied}
                  haptic="success"
                  onPress={copyLista}
                  style={styles.cta}
                  accessibilityRole="button"
                >
                  <Text style={styles.ctaTxt}>{copied ? cta.copied : cta.copy}</Text>
                </CtaPressable>
                {restartLink}
              </>
            ) : (
              <CtaPressable enabled={canContinue()} haptic="selection" onPress={next} style={styles.cta}>
                <Text style={styles.ctaTxt}>{ctaLabel()}</Text>
              </CtaPressable>
            )}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ProgressFill({ progress, reduceMotion }: { progress: number; reduceMotion: boolean }) {
  const p = useSharedValue(progress);

  useEffect(() => {
    p.value = reduceMotion ? progress : withTiming(progress, { duration: stepMs, easing: easeOut });
  }, [p, progress, reduceMotion]);

  const style = useAnimatedStyle(() => ({
    width: `${p.value * 100}%`,
  }));

  return <Animated.View style={[styles.progressFill, style]} />;
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
  scrollLista: { paddingBottom: 8 },
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
  hungerCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    gap: 10,
  },
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
  warn: { color: C.accent, fontSize: 16 },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  listaCopy: { marginTop: 28 },
  cta: {
    backgroundColor: C.ink,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaTxt: { color: C.card, fontWeight: '800', fontSize: 16 },
});
