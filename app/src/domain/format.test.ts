import assert from 'node:assert/strict';
import { test } from 'node:test';
import { groupItens, listaTexto } from './format';
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

test('texto copiado lista cada item com a quantidade e fecha com a carne total', () => {
  const texto = listaTexto({
    ok: true,
    carneKg: 3,
    itens: [
      { id: 'picanha', nome: 'Picanha', quantidade: 1.5, unidade: 'kg', secao: 'carne' },
      { id: 'pao_de_alho', nome: 'Pão de alho', quantidade: 6, unidade: 'un', secao: 'acompanhamento' },
    ],
  });
  assert.equal(texto, 'Lista do Churras\n\nPicanha: 1,5 kg\nPão de alho: 6 un\n\nCarne total: 3,0 kg');
});

test('texto copiado de uma lista inválida é o motivo', () => {
  assert.equal(listaTexto({ ok: false, motivo: 'Escolha pelo menos um corte.' }), 'Escolha pelo menos um corte.');
});
