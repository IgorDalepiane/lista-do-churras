import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  formatUnitPrice,
  groupItens,
  unitPriceHint,
  unitPriceLabel,
} from './format';
import type { ListaItem } from './types';

test('rótulo de preço deixa a unidade explícita', () => {
  assert.equal(unitPriceLabel('kg'), 'R$/kg');
  assert.equal(unitPriceLabel('L'), 'R$/L');
  assert.equal(unitPriceLabel('un'), 'R$/un');
  assert.equal(formatUnitPrice(89.9, 'kg'), 'R$\u00a089,90/kg');
});

test('cerveja avisa que o preço é por litro, não por lata', () => {
  assert.match(unitPriceHint({ id: 'cerveja', unidade: 'L' }), /litro/i);
  assert.match(unitPriceHint({ id: 'cerveja', unidade: 'L' }), /lata/i);
  assert.match(unitPriceHint({ id: 'refrigerante', unidade: 'L' }), /2 L/i);
  assert.match(unitPriceHint({ id: 'agua', unidade: 'L' }), /garrafinha/i);
  assert.equal(unitPriceHint({ id: 'pao', unidade: 'un' }), 'por unidade');
  assert.equal(unitPriceHint({ id: 'picanha', unidade: 'kg' }), 'por quilo');
});

test('lista agrupa carne, mesa, fogo e bebida nessa ordem', () => {
  const itens: ListaItem[] = [
    { id: 'cerveja', nome: 'Cerveja', quantidade: 8, unidade: 'L', secao: 'bebida' },
    { id: 'picanha', nome: 'Picanha', quantidade: 2, unidade: 'kg', secao: 'carne' },
    { id: 'carvao', nome: 'Carvão', quantidade: 3, unidade: 'kg', secao: 'carvao' },
    { id: 'pao', nome: 'Pão', quantidade: 6, unidade: 'un', secao: 'acompanhamento' },
  ];
  const groups = groupItens(itens);
  assert.deepEqual(
    groups.map((g) => g.secao),
    ['carne', 'acompanhamento', 'carvao', 'bebida'],
  );
});
