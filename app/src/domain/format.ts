import type { Lista, ListaItem, ListaSecao } from './types';

export const SECAO_LABEL: Record<ListaSecao, string> = {
  carne: 'Carne',
  acompanhamento: 'Mesa',
  carvao: 'Fogo',
  bebida: 'Bebida',
};

export function groupItens(itens: ListaItem[]): { secao: ListaSecao; itens: ListaItem[] }[] {
  const order: ListaSecao[] = ['carne', 'acompanhamento', 'carvao', 'bebida'];
  return order
    .map((secao) => ({ secao, itens: itens.filter((i) => i.secao === secao) }))
    .filter((g) => g.itens.length > 0);
}

export function formatQty(n: number, unidade: string): string {
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: unidade === 'un' ? 0 : 1,
    maximumFractionDigits: unidade === 'un' ? 0 : 2,
  }).format(n);
  return `${formatted} ${unidade}`;
}

export function listaTexto(lista: Lista): string {
  if (!lista.ok) return lista.motivo;
  const lines = ['Lista do Churras', ''];
  for (const item of lista.itens) {
    lines.push(`${item.nome}: ${formatQty(item.quantidade, item.unidade)}`);
  }
  lines.push('');
  lines.push(`Carne total: ${formatQty(lista.carneKg, 'kg')}`);
  return lines.join('\n');
}
