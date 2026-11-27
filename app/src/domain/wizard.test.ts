import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  INITIAL_WIZARD,
  parseSavedWizard,
  reconcile,
  serializeWizard,
  stepsFor,
  type WizardAnswers,
  type WizardState,
} from './wizard';

const answers = (over: Partial<WizardAnswers> = {}): WizardAnswers => ({
  ...INITIAL_WIZARD.answers,
  homens: 4,
  mulheres: 3,
  criancas: 2,
  fomeHomem: 'muito',
  fomeMulher: 'pouco',
  fomeCrianca: 'medio',
  horas: 6,
  corteIds: ['picanha', 'linguica'],
  percentuais: { picanha: 70, linguica: 30 },
  acompanhamentoIds: ['farofa', 'pao_de_alho'],
  bebidaAlcoolica: true,
  quantosBebem: 5,
  incluirRefrigerante: false,
  incluirAgua: true,
  ...over,
});

const saved = (step: string, a: Record<string, unknown>): string => JSON.stringify({ v: 1, step, answers: a });

test('salvar e restaurar devolve o mesmo assistente', () => {
  const state: WizardState = { step: 'lista', answers: answers() };
  assert.equal(stepsFor(state.answers).length, 9);
  assert.deepEqual(parseSavedWizard(serializeWizard(state)), state);
});

test('save ausente, quebrado ou de outra versão volta ao início', () => {
  for (const raw of [null, '', '{', '[]', '"x"', JSON.stringify({ v: 2, step: 'lista', answers: answers() })]) {
    assert.deepEqual(parseSavedWizard(raw), INITIAL_WIZARD, String(raw));
  }
});

test('corte que saiu do catálogo some, a divisão volta a 100% e o passo recua', () => {
  const restored = parseSavedWizard(
    saved('partilha', { ...answers(), corteIds: ['picanha', 'wagyu'], percentuais: { picanha: 60, wagyu: 40 } }),
  );
  assert.deepEqual(restored.answers.corteIds, ['picanha']);
  assert.deepEqual(restored.answers.percentuais, { picanha: 100 });
  assert.equal(restored.step, 'bebem');
});

test('sem nenhum corte conhecido reabre na escolha de cortes', () => {
  const restored = parseSavedWizard(saved('lista', { ...answers(), corteIds: ['wagyu'], percentuais: { wagyu: 100 } }));
  assert.equal(restored.step, 'cortes');
});

test('um campo inválido usa o padrão e os outros ficam', () => {
  const restored = parseSavedWizard(saved('fome', { ...answers(), homens: '9' }));
  assert.deepEqual(restored, { step: 'fome', answers: answers({ homens: INITIAL_WIZARD.answers.homens }) });
});

test('sem cerveja ninguém bebe', () => {
  const restored = parseSavedWizard(saved('bebida', { ...answers(), bebidaAlcoolica: false, quantosBebem: 4 }));
  assert.equal(restored.answers.quantosBebem, 0);
});

test('passo desconhecido reabre no começo', () => {
  assert.equal(parseSavedWizard(saved('sobremesa', answers())).step, 'cortes');
});

test('reconcile segura quem bebe no total de pessoas e refaz a divisão quando os cortes mudam', () => {
  const fewer = reconcile(answers({ homens: 1, mulheres: 1, criancas: 0, quantosBebem: 5 }));
  assert.equal(fewer.quantosBebem, 2);
  const moreCuts = reconcile(answers({ corteIds: ['picanha', 'linguica', 'frango'] }));
  const sum = Object.values(moreCuts.percentuais).reduce((s, n) => s + n, 0);
  assert.deepEqual(Object.keys(moreCuts.percentuais).sort(), ['frango', 'linguica', 'picanha']);
  assert.equal(Math.round(sum * 10) / 10, 100);
  const kept = answers();
  assert.equal(reconcile(kept).percentuais, kept.percentuais);
});
