import type { Lista, ListaItem, ListaSecao, Unit } from './types';

export const SECAO_LABEL: Record<ListaSecao, string> = {
  carne: 'Carne',
  acompanhamento: 'Mesa',
  carvao: 'Fogo',
  bebida: 'Bebida',
};

export function unitPriceLabel(unidade: Unit): string {
  if (unidade === 'kg') return 'R$/kg';
  if (unidade === 'L') return 'R$/L';
  return 'R$/un';
}

export function unitPriceHint(item: Pick<ListaItem, 'id' | 'unidade'>): string {
  if (item.id === 'cerveja') return 'por litro — não o preço da lata';
  if (item.id === 'gelo') return 'por quilo do saco';
  if (item.unidade === 'un') return 'por unidade';
  if (item.unidade === 'L') return 'por litro';
  return 'por quilo';
}

export function formatUnitPrice(n: number, unidade: Unit): string {
  return `${formatMoney(n)}/${unidade === 'un' ? 'un' : unidade}`;
}

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

export function formatMoney(n: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
}

export function parseBrNumber(raw: string): number | null {
  const t = raw.trim().replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function listaTexto(lista: Lista, precos: Record<string, string>): string {
  if (!lista.ok) return lista.motivo;
  const lines = ['Lista do Churras', ''];
  let total = 0;
  for (const item of lista.itens) {
    const qty = formatQty(item.quantidade, item.unidade);
    const preco = parseBrNumber(precos[item.id] ?? '');
    if (preco != null) {
      const linha = item.quantidade * preco;
      total += linha;
      lines.push(`${item.nome}: ${qty} × ${formatUnitPrice(preco, item.unidade)} = ${formatMoney(linha)}`);
    } else {
      lines.push(`${item.nome}: ${qty}`);
    }
  }
  lines.push('');
  lines.push(`Carne total: ${formatQty(lista.carneKg, 'kg')}`);
  if (total > 0) {
    lines.push(`Total estimado: ${formatMoney(total)} (ideia de quanto vai dar, não a conta de cada um)`);
  }
  return lines.join('\n');
}

export function totalEstimado(lista: Lista, precos: Record<string, string>): number {
  if (!lista.ok) return 0;
  let total = 0;
  for (const item of lista.itens) {
    const preco = parseBrNumber(precos[item.id] ?? '');
    if (preco != null) total += item.quantidade * preco;
  }
  return total;
}
