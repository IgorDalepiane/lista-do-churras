import { StatusBar } from 'expo-status-bar';
import * as Clipboard from 'expo-clipboard';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { calcularLista, equalPercents, rebalancePercents } from './src/domain/calculate';
import { CUTS, HUNGER_LABEL, SIDES } from './src/domain/catalog';
import {
  formatMoney,
  formatQty,
  formatUnitPrice,
  groupItens,
  listaTexto,
  parseBrNumber,
  SECAO_LABEL,
  totalEstimado,
  unitPriceHint,
  unitPriceLabel,
} from './src/domain/format';
import type { CutId, Hunger, ListaItem, SideId } from './src/domain/types';
import { Counter, Grid, Radio, Screen, Segmented, SelectCard } from './src/ui/kit';
import { C, TILE } from './src/ui/theme';

const CUT_EMOJI: Record<CutId, string> = {
  picanha: '🥩',
  alcatra: '🍖',
  maminha: '🥓',
  fraldinha: '🍗',
  contrafile: '🥩',
  costela: '🔥',
  cupim: '🧀',
  linguica: '🌭',
  frango: '🐥',
  coracao: '❤️',
};

const SIDE_EMOJI: Record<SideId, string> = {
  farofa: '🌾',
  vinagrete: '🥗',
  pao: '🍞',
  gelo: '🧊',
  copo: '🥤',
  prato: '🍽️',
};

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

type StepId =
  | 'cortes'
  | 'acompanhamentos'
  | 'gente'
  | 'fome'
  | 'horas'
  | 'bebida'
  | 'bebem'
  | 'partilha'
  | 'lista';

const STEP_NAME: Record<StepId, string> = {
  cortes: 'Grelha',
  acompanhamentos: 'Mesa',
  gente: 'Gente',
  fome: 'Fome',
  horas: 'Fogo',
  bebida: 'Cerveja',
  bebem: 'Quem bebe',
  partilha: 'Partilha',
  lista: 'Lista',
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppInner />
    </SafeAreaProvider>
  );
}

function AppInner() {
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

  const people = homens + mulheres + criancas;
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
        quantosBebem: Math.min(quantosBebem, people),
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
      people,
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
    const nextPeople = nextH + nextM + nextC;
    if (kind === 'h') setHomens(n);
    if (kind === 'm') setMulheres(n);
    if (kind === 'c') setCriancas(n);
    setQuantosBebem((q) => Math.min(q, nextPeople));
  }

  function canContinue(): boolean {
    if (step === 'cortes') return corteIds.length > 0;
    if (step === 'gente') return people > 0;
    if (step === 'horas') return horas > 0;
    if (step === 'bebida') return bebidaAlcoolica !== null;
    if (step === 'bebem') return quantosBebem >= 0 && quantosBebem <= people;
    if (step === 'lista') return lista.ok;
    return true;
  }

  function next() {
    if (!canContinue()) return;
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  }

  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function copyLista() {
    await Clipboard.setStringAsync(listaTexto(lista, precos));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function ctaLabel(): string {
    if (step === 'lista') return copied ? 'Copiado' : 'Copiar lista';
    if (step === 'acompanhamentos' && acompanhamentoIds.length === 0) return 'Pular a mesa';
    if (steps[stepIndex + 1] === 'lista') return 'Ver a lista';
    return 'Continuar';
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.top}>
          <Pressable style={styles.navCircle} onPress={back} disabled={stepIndex === 0}>
            <Text style={[styles.navGlyph, stepIndex === 0 && { opacity: 0.25 }]}>‹</Text>
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
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {step === 'cortes' && (
            <Screen
              title="O que vai para a grelha?"
              sub={
                corteIds.length
                  ? `${corteIds.length} corte${corteIds.length > 1 ? 's' : ''} — o kg a gente calcula no fim.`
                  : 'Marca o que vai comprar. Dá para misturar picanha com linguiça.'
              }
            >
              <Grid>
                {CUTS.map((c, i) => (
                  <SelectCard
                    key={c.id}
                    emoji={CUT_EMOJI[c.id]}
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
            <Screen
              title="E na mesa?"
              sub={
                acompanhamentoIds.length
                  ? `${acompanhamentoIds.length} item${acompanhamentoIds.length > 1 ? 's' : ''} fora da grelha.`
                  : 'Farofa, pão, gelo… se só quer carne, pula.'
              }
            >
              <Grid>
                {SIDES.map((s, i) => (
                  <SelectCard
                    key={s.id}
                    emoji={SIDE_EMOJI[s.id]}
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
            <Screen title="Quem vem?" sub="O tamanho do churrasco é a quantidade de gente — não o nome do evento.">
              <PeopleRow emoji="👨" label="Homens" value={homens} onChange={(n) => setPeople('h', n)} />
              <PeopleRow emoji="👩" label="Mulheres" value={mulheres} onChange={(n) => setPeople('m', n)} />
              <PeopleRow emoji="🧒" label="Crianças" value={criancas} onChange={(n) => setPeople('c', n)} />
              <Text style={styles.liveTotal}>
                {people} {people === 1 ? 'pessoa' : 'pessoas'} na brasa
              </Text>
            </Screen>
          )}

          {step === 'fome' && (
            <Screen title="Como está a fome?" sub="Um nível por grupo. Quem não vem, a gente nem pergunta.">
              {homens > 0 && (
                <HungerRow label="Homens" value={fomeHomem} onChange={setFomeHomem} />
              )}
              {mulheres > 0 && (
                <HungerRow label="Mulheres" value={fomeMulher} onChange={setFomeMulher} />
              )}
              {criancas > 0 && (
                <HungerRow label="Crianças" value={fomeCrianca} onChange={setFomeCrianca} />
              )}
            </Screen>
          )}

          {step === 'horas' && (
            <Screen title="Quanto tempo de fogo?" sub="Churrasco longo pede mais carne. Dá para passar de 12 h.">
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
              <Text style={styles.micro}>Ou ajusta na unha</Text>
              <Counter value={horas} onChange={setHoras} min={1} />
              {lista.ok ? (
                <View style={styles.preview}>
                  <Text style={styles.previewKicker}>Cerca de</Text>
                  <Text style={styles.previewHero}>{formatQty(lista.carneKg, 'kg')} de carne</Text>
                </View>
              ) : null}
            </Screen>
          )}

          {step === 'bebida' && (
            <Screen title="Vai ter cerveja?" sub="Se ligar, na próxima pergunta quantos bebem — no máximo as pessoas que vêm.">
              <Radio
                label="Sim, tem quem bebe"
                hint={`${people} ${people === 1 ? 'pessoa' : 'pessoas'} no total`}
                on={bebidaAlcoolica === true}
                onPress={() => {
                  setBebidaAlcoolica(true);
                  if (quantosBebem === 0) {
                    setQuantosBebem(Math.min(people, Math.max(1, adults)));
                  }
                }}
              />
              <Radio
                label="Não, só o churrasco"
                hint="A lista fica sem litro de cerveja"
                on={bebidaAlcoolica === false}
                onPress={() => {
                  setBebidaAlcoolica(false);
                  setQuantosBebem(0);
                }}
              />
            </Screen>
          )}

          {step === 'bebem' && (
            <Screen
              title="Quantos bebem?"
              sub={`De ${people} ${people === 1 ? 'pessoa' : 'pessoas'}. Criança conta no total, mas o padrão é só adulto.`}
            >
              <Counter value={quantosBebem} onChange={setQuantosBebem} min={0} max={people} />
              <Pressable
                onPress={() => setQuantosBebem(Math.min(people, adults))}
                style={styles.ghostLink}
              >
                <Text style={styles.link}>Usar só os adultos ({adults})</Text>
              </Pressable>
            </Screen>
          )}

          {step === 'partilha' && (
            <Screen title="Como parte a carne?" sub="A soma é 100% da carne. Farofa e carvão ficam fora desta conta.">
              {corteIds.map((id) => {
                const nome = CUTS.find((c) => c.id === id)?.nome ?? id;
                const pct = percentuais[id] ?? 0;
                const kg =
                  lista.ok ? lista.itens.find((i) => i.id === id)?.quantidade : undefined;
                return (
                  <View key={id} style={styles.splitCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.splitName}>
                        {CUT_EMOJI[id]} {nome}
                      </Text>
                      {kg != null ? (
                        <Text style={styles.splitKg}>{formatQty(kg, 'kg')}</Text>
                      ) : null}
                    </View>
                    <View style={styles.splitRow}>
                      <Pressable
                        style={styles.roundBtn}
                        onPress={() =>
                          setPercentuais(rebalancePercents(corteIds, percentuais, id, pct - 5))
                        }
                      >
                        <Text style={styles.roundBtnTxt}>−</Text>
                      </Pressable>
                      <Text style={styles.splitPct}>{Math.round(pct)}%</Text>
                      <Pressable
                        style={styles.roundBtn}
                        onPress={() =>
                          setPercentuais(rebalancePercents(corteIds, percentuais, id, pct + 5))
                        }
                      >
                        <Text style={styles.roundBtnTxt}>+</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
              <Pressable onPress={() => setPercentuais(equalPercents(corteIds))} style={styles.ghostLink}>
                <Text style={styles.link}>Voltar ao recomendado (partilha igual)</Text>
              </Pressable>
            </Screen>
          )}

          {step === 'lista' && (
            <Screen
              title="Sua lista"
              sub="Kg primeiro. Preço é opcional — cola o valor do açougue na unidade certa."
            >
              {!lista.ok ? (
                <Text style={styles.warn}>{lista.motivo}</Text>
              ) : (
                <>
                  <View style={styles.heroCard}>
                    <Text style={styles.heroKicker}>Para levar</Text>
                    <Text style={styles.hero}>{formatQty(lista.carneKg, 'kg')}</Text>
                    <Text style={styles.heroSub}>de carne</Text>
                    <Text style={styles.heroMeta}>
                      {people} {people === 1 ? 'pessoa' : 'pessoas'} · {horas} h de fogo
                    </Text>
                  </View>

                  {groupItens(lista.itens).map((g) => (
                    <View key={g.secao} style={styles.section}>
                      <Text style={styles.sectionTitle}>{SECAO_LABEL[g.secao]}</Text>
                      {g.itens.map((item) => (
                        <PriceCard
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
                      <Text style={styles.totalKicker}>
                        {pricedCount} de {lista.itens.length} com preço
                      </Text>
                      <Text style={styles.total}>Total estimado {formatMoney(total)}</Text>
                      <Text style={styles.totalHint}>Ideia de quanto vai dar — não a conta de cada um.</Text>
                    </View>
                  ) : (
                    <Text style={styles.microLeft}>
                      Sem preço a lista ainda serve: é o que comprar, em kg, litro e unidade.
                    </Text>
                  )}
                </>
              )}
              <View style={styles.ad} accessibilityLabel="Espaço de anúncio">
                <Text style={styles.adTxt}>Anúncio — os números ficam acima</Text>
              </View>
            </Screen>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.cta, !canContinue() && styles.ctaOff]}
            onPress={step === 'lista' ? copyLista : next}
            disabled={!canContinue()}
          >
            <Text style={styles.ctaTxt}>{ctaLabel()}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function PeopleRow({
  emoji,
  label,
  value,
  onChange,
}: {
  emoji: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <View style={styles.peopleCard}>
      <Text style={styles.peopleLabel}>
        {emoji} {label}
      </Text>
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

function PriceCard({
  item,
  value,
  onChange,
}: {
  item: ListaItem;
  value: string;
  onChange: (t: string) => void;
}) {
  const preco = parseBrNumber(value);
  const linha = preco != null ? item.quantidade * preco : null;
  const unitLabel = unitPriceLabel(item.unidade);

  return (
    <View style={styles.priceCard}>
      <View style={styles.priceHead}>
        <Text style={styles.itemName}>{item.nome}</Text>
        <View style={styles.qtyPill}>
          <Text style={styles.qtyPillTxt}>{formatQty(item.quantidade, item.unidade)}</Text>
        </View>
      </View>
      <Text style={styles.priceHint}>Preço {unitPriceHint(item)}</Text>
      <View style={styles.priceField}>
        <TextInput
          style={styles.priceInput}
          placeholder="0,00"
          placeholderTextColor={C.muted}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onChange}
          accessibilityLabel={`${item.nome}, ${unitLabel}`}
        />
        <View style={styles.unitChip}>
          <Text style={styles.unitChipTxt}>{unitLabel}</Text>
        </View>
      </View>
      {linha != null && preco != null ? (
        <Text style={styles.lineTotal}>
          {formatQty(item.quantidade, item.unidade)} × {formatUnitPrice(preco, item.unidade)} = {formatMoney(linha)}
        </Text>
      ) : (
        <Text style={styles.priceOptional}>opcional — sem isso a lista vai só com a quantidade</Text>
      )}
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
  navGlyph: { fontSize: 28, color: C.ink, marginTop: -2 },
  progressTrack: { height: 6, borderRadius: 99, backgroundColor: C.line, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: C.accent, borderRadius: 99 },
  stepCaption: { color: C.muted, fontSize: 12, marginTop: 6, fontWeight: '600' },
  scroll: { paddingHorizontal: 20, paddingBottom: 28 },
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
  peopleLabel: { color: C.ink, fontWeight: '700', fontSize: 16, marginBottom: 8 },
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
  priceCard: {
    backgroundColor: C.card,
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
  },
  priceHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemName: { flex: 1, color: C.ink, fontWeight: '800', fontSize: 16 },
  qtyPill: {
    backgroundColor: C.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyPillTxt: { color: C.accent, fontWeight: '800', fontSize: 12 },
  priceHint: { color: C.muted, fontSize: 13, marginTop: 8, marginBottom: 8 },
  priceField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg,
    borderRadius: 14,
    paddingLeft: 12,
    borderWidth: 1,
    borderColor: C.line,
  },
  priceInput: {
    flex: 1,
    height: 48,
    color: C.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  unitChip: {
    backgroundColor: C.ink,
    height: 48,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 13,
    borderBottomRightRadius: 13,
  },
  unitChipTxt: { color: C.card, fontWeight: '800', fontSize: 14 },
  lineTotal: { color: C.ok, fontWeight: '700', marginTop: 8, fontSize: 13 },
  priceOptional: { color: C.muted, marginTop: 8, fontSize: 12 },
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
  ad: {
    height: 64,
    borderRadius: 16,
    backgroundColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  adTxt: { color: C.muted, fontSize: 12 },
  footer: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  cta: {
    backgroundColor: C.ink,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaOff: { backgroundColor: C.ctaOff },
  ctaTxt: { color: C.card, fontWeight: '800', fontSize: 16 },
});
