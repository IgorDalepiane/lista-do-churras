import assert from 'node:assert/strict';
import { test } from 'node:test';
import { groupItens } from './format';
import type { ListaItem } from './types';

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
