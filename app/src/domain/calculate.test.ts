import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calcularLista, durationMul, equalPercents, rebalancePercents } from './calculate';
import type { ChurrascoInput } from './types';

const base = (over: Partial<ChurrascoInput> = {}): ChurrascoInput => ({
  homens: 6,
  mulheres: 0,
  criancas: 0,
  fomeHomem: 'medio',
  fomeMulher: 'medio',
  fomeCrianca: 'medio',
  horas: 4,
  corteIds: ['picanha'],
  percentuais: { picanha: 100 },
  acompanhamentoIds: [],
  bebidaAlcoolica: false,
  quantosBebem: 0,
  ...over,
});

test('mesmo input produz a mesma lista', () => {
  const a = calcularLista(base());
  const b = calcularLista(base());
  assert.deepEqual(a, b);
});

test('6 homens médio 4h: carvão >= 3 kg (nunca 2 kg)', () => {
  const lista = calcularLista(base());
  assert.equal(lista.ok, true);
  if (!lista.ok) return;
  const carvao = lista.itens.find((i) => i.id === 'carvao');
  assert.ok(carvao);
  assert.ok(carvao.quantidade >= 3);
});

test('22 homens não explode carvão tipo 53 kg', () => {
  const lista = calcularLista(base({ homens: 22 }));
  assert.equal(lista.ok, true);
  if (!lista.ok) return;
  const carvao = lista.itens.find((i) => i.id === 'carvao');
  assert.ok(carvao);
  assert.ok(carvao.quantidade < 20);
});

test('recalcular com as mesmas entradas não soma', () => {
  const first = calcularLista(base());
  const second = calcularLista(base());
  assert.deepEqual(first, second);
  const more = calcularLista(base({ homens: 8 }));
  assert.equal(first.ok && more.ok, true);
  if (first.ok && more.ok) {
    assert.ok(more.carneKg > first.carneKg);
    assert.ok(more.carneKg < first.carneKg * 2);
  }
});

test('um corte leva 100% da carne', () => {
  const lista = calcularLista(base());
  assert.equal(lista.ok, true);
  if (!lista.ok) return;
  const picanha = lista.itens.find((i) => i.id === 'picanha');
  assert.equal(picanha?.quantidade, lista.carneKg);
});

test('dois cortes partilham 100% e farofa não entra na pizza', () => {
  const lista = calcularLista(
    base({
      corteIds: ['picanha', 'linguica'],
      percentuais: { picanha: 70, linguica: 30 },
      acompanhamentoIds: ['farofa'],
    }),
  );
  assert.equal(lista.ok, true);
  if (!lista.ok) return;
  const picanha = lista.itens.find((i) => i.id === 'picanha');
  const linguica = lista.itens.find((i) => i.id === 'linguica');
  const farofa = lista.itens.find((i) => i.id === 'farofa');
  assert.ok(picanha && linguica && farofa);
  assert.equal(Math.round((picanha.quantidade + linguica.quantidade) * 100) / 100, lista.carneKg);
  assert.ok(Math.abs(picanha.quantidade / lista.carneKg - 0.7) < 0.02);
});

test('bebida ligada sem quantos bebem inválido se NaN tratado no caller; teto pessoas', () => {
  const over = calcularLista(base({ bebidaAlcoolica: true, quantosBebem: 9 }));
  assert.equal(over.ok, false);
  const ok = calcularLista(base({ bebidaAlcoolica: true, quantosBebem: 4 }));
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.ok(ok.itens.some((i) => i.id === 'cerveja' && i.unidade === 'L'));
  }
  const off = calcularLista(base({ bebidaAlcoolica: false, quantosBebem: 4 }));
  assert.equal(off.ok, true);
  if (off.ok) {
    assert.equal(off.itens.some((i) => i.id === 'cerveja'), false);
  }
});

test('zero pessoas ou zero cortes bloqueia', () => {
  assert.equal(calcularLista(base({ homens: 0 })).ok, false);
  assert.equal(calcularLista(base({ corteIds: [] })).ok, false);
});

test('duração maior não reduz carne', () => {
  const short = calcularLista(base({ horas: 3 }));
  const long = calcularLista(base({ horas: 10 }));
  assert.ok(short.ok && long.ok);
  if (short.ok && long.ok) {
    assert.ok(long.carneKg >= short.carneKg);
  }
});

test('rebalance mantém soma 100', () => {
  const next = rebalancePercents(['picanha', 'linguica', 'frango'], { picanha: 40, linguica: 30, frango: 30 }, 'picanha', 70);
  const sum = Object.values(next).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 100) < 0.15);
  assert.equal(next.picanha, 70);
});

test('equal percents somam 100', () => {
  const p = equalPercents(['a', 'b', 'c']);
  const sum = Object.values(p).reduce((a, b) => a + b, 0);
  assert.equal(Math.round(sum * 10) / 10, 100);
});

test('durationMul não decresce', () => {
  assert.ok(durationMul(5) >= durationMul(3));
  assert.ok(durationMul(14) >= durationMul(10));
});
