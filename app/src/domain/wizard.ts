import { equalPercents } from './calculate';
import { CUTS, SIDES } from './catalog';
import type { ChurrascoInput, CutId, Hunger, SideId } from './types';

export type StepId =
  | 'cortes'
  | 'acompanhamentos'
  | 'gente'
  | 'fome'
  | 'horas'
  | 'bebida'
  | 'bebem'
  | 'partilha'
  | 'lista';

const STEP_ORDER: readonly StepId[] = [
  'cortes',
  'acompanhamentos',
  'gente',
  'fome',
  'horas',
  'bebida',
  'bebem',
  'partilha',
  'lista',
];

export type WizardAnswers = Omit<ChurrascoInput, 'bebidaAlcoolica'> & {
  bebidaAlcoolica: boolean | null;
};

export type WizardState = {
  readonly answers: WizardAnswers;
  readonly step: StepId;
};

export const INITIAL_WIZARD: WizardState = {
  step: 'cortes',
  answers: {
    homens: 6,
    mulheres: 0,
    criancas: 0,
    fomeHomem: 'medio',
    fomeMulher: 'medio',
    fomeCrianca: 'medio',
    horas: 4,
    corteIds: [],
    percentuais: {},
    acompanhamentoIds: [],
    bebidaAlcoolica: null,
    quantosBebem: 0,
    incluirRefrigerante: true,
    incluirAgua: false,
  },
};

function people(a: WizardAnswers): number {
  return a.homens + a.mulheres + a.criancas;
}

export function stepsFor(answers: WizardAnswers): StepId[] {
  return STEP_ORDER.filter((s) => {
    if (s === 'bebem') return answers.bebidaAlcoolica === true;
    if (s === 'partilha') return answers.corteIds.length >= 2;
    return true;
  });
}

export function canAdvance(step: StepId, answers: WizardAnswers): boolean {
  if (step === 'cortes') return answers.corteIds.length > 0;
  if (step === 'gente') return people(answers) > 0;
  if (step === 'horas') return answers.horas > 0;
  if (step === 'bebida') return answers.bebidaAlcoolica !== null;
  if (step === 'bebem') return answers.quantosBebem >= 0 && answers.quantosBebem <= people(answers);
  return true;
}

export function toChurrascoInput(answers: WizardAnswers): ChurrascoInput {
  return {
    ...answers,
    bebidaAlcoolica: answers.bebidaAlcoolica === true,
    quantosBebem: Math.min(answers.quantosBebem, people(answers)),
  };
}

export function reconcile(a: WizardAnswers): WizardAnswers {
  const sum = a.corteIds.reduce((s, id) => s + (a.percentuais[id] ?? 0), 0);
  const splitMatches =
    Object.keys(a.percentuais).length === a.corteIds.length &&
    a.corteIds.every((id) => id in a.percentuais) &&
    (a.corteIds.length === 0 || Math.abs(sum - 100) <= 0.5);
  return {
    ...a,
    percentuais: splitMatches ? a.percentuais : equalPercents(a.corteIds),
    quantosBebem: a.bebidaAlcoolica === true ? Math.min(a.quantosBebem, people(a)) : 0,
  };
}

const SAVE_VERSION = 1;

type SavedWizardV1 = { v: 1; step: string; answers: Record<string, unknown> };

export function serializeWizard(state: WizardState): string {
  return JSON.stringify({ v: SAVE_VERSION, step: state.step, answers: state.answers } satisfies SavedWizardV1);
}

export function parseSavedWizard(raw: string | null): WizardState {
  if (raw == null) return INITIAL_WIZARD;
  let saved: unknown;
  try {
    saved = JSON.parse(raw);
  } catch {
    return INITIAL_WIZARD;
  }
  if (!isRecord(saved) || saved.v !== SAVE_VERSION || !isRecord(saved.answers)) return INITIAL_WIZARD;
  const savedAnswers = saved.answers;
  const loose = Object.fromEntries(
    (Object.keys(FIELD_PARSERS) as (keyof WizardAnswers)[]).map((k) => [k, field(k, savedAnswers)]),
  ) as WizardAnswers;
  const answers = reconcile(loose);
  return { answers, step: resolveStep(answers, typeof saved.step === 'string' ? saved.step : null) };
}

const CUT_IDS: ReadonlySet<CutId> = new Set(CUTS.map((c) => c.id));
const SIDE_IDS: ReadonlySet<SideId> = new Set(SIDES.map((s) => s.id));
const HUNGERS: ReadonlySet<Hunger> = new Set(['pouco', 'medio', 'muito']);

const FIELD_PARSERS: { [K in keyof WizardAnswers]: (raw: unknown) => WizardAnswers[K] | undefined } = {
  homens: (v) => intIn(v, 0, 999),
  mulheres: (v) => intIn(v, 0, 999),
  criancas: (v) => intIn(v, 0, 999),
  fomeHomem: (v) => member(v, HUNGERS),
  fomeMulher: (v) => member(v, HUNGERS),
  fomeCrianca: (v) => member(v, HUNGERS),
  horas: (v) => intIn(v, 1, 12),
  corteIds: (v) => knownIds(v, CUT_IDS),
  percentuais: (v) => percentMap(v),
  acompanhamentoIds: (v) => knownIds(v, SIDE_IDS),
  bebidaAlcoolica: (v) => (v === true || v === false || v === null ? v : undefined),
  quantosBebem: (v) => intIn(v, 0, 999),
  incluirRefrigerante: (v) => (typeof v === 'boolean' ? v : undefined),
  incluirAgua: (v) => (typeof v === 'boolean' ? v : undefined),
};

function field<K extends keyof WizardAnswers>(k: K, saved: Record<string, unknown>): WizardAnswers[K] {
  return FIELD_PARSERS[k](saved[k]) ?? INITIAL_WIZARD.answers[k];
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function intIn(v: unknown, min: number, max: number): number | undefined {
  return typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max ? v : undefined;
}

function member<T extends string>(v: unknown, known: ReadonlySet<T>): T | undefined {
  return typeof v === 'string' && (known as ReadonlySet<string>).has(v) ? (v as T) : undefined;
}

function knownIds<T extends string>(v: unknown, known: ReadonlySet<T>): T[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const ids: T[] = [];
  for (const x of v) {
    const id = member(x, known);
    if (id !== undefined && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

function percentMap(v: unknown): Record<string, number> | undefined {
  if (!isRecord(v)) return undefined;
  const valid = Object.values(v).every((n) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 100);
  return valid ? (v as Record<string, number>) : undefined;
}

function resolveStep(answers: WizardAnswers, saved: string | null): StepId {
  const steps = stepsFor(answers);
  const target = lastStepUpTo(steps, saved);
  return firstBlockedBefore(steps, target, answers) ?? target;
}

function lastStepUpTo(steps: StepId[], saved: string | null): StepId {
  const savedPos = STEP_ORDER.indexOf(saved as StepId);
  return [...steps].reverse().find((s) => STEP_ORDER.indexOf(s) <= savedPos) ?? steps[0];
}

function firstBlockedBefore(steps: StepId[], target: StepId, answers: WizardAnswers): StepId | undefined {
  return steps.slice(0, steps.indexOf(target)).find((s) => !canAdvance(s, answers));
}
