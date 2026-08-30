import { BASE_G, CUTS, HUNGER_MUL, SIDES } from './catalog';
import type { ChurrascoInput, CutId, Hunger, Lista, ListaItem, SideId } from './types';

export function durationMul(hours: number): number {
  const h = Math.min(12, Math.max(1, hours));
  if (h < 4) return 0.85;
  if (h >= 12) return 1.4;
  return roundKg(1 + ((h - 4) / 8) * 0.4);
}

export function equalPercents(ids: string[]): Record<string, number> {
  if (ids.length === 0) return {};
  const raw = 100 / ids.length;
  const out: Record<string, number> = {};
  let allocated = 0;
  ids.forEach((id, i) => {
    if (i === ids.length - 1) {
      out[id] = Math.round((100 - allocated) * 10) / 10;
    } else {
      const v = Math.round(raw * 10) / 10;
      out[id] = v;
      allocated += v;
    }
  });
  return out;
}

export function rebalancePercents(
  ids: string[],
  current: Record<string, number>,
  changedId: string,
  nextPct: number,
): Record<string, number> {
  const clamped = Math.min(100, Math.max(0, nextPct));
  if (ids.length === 1) return { [ids[0]]: 100 };
  const others = ids.filter((id) => id !== changedId);
  const rest = 100 - clamped;
  const othersSum = others.reduce((s, id) => s + (current[id] ?? 0), 0);
  const out: Record<string, number> = { [changedId]: Math.round(clamped * 10) / 10 };
  if (othersSum <= 0) {
    const even = rest / others.length;
    others.forEach((id, i) => {
      out[id] = i === others.length - 1
        ? Math.round((100 - Object.values(out).reduce((a, b) => a + b, 0)) * 10) / 10
        : Math.round(even * 10) / 10;
    });
    return out;
  }
  let allocated = out[changedId];
  others.forEach((id, i) => {
    if (i === others.length - 1) {
      out[id] = Math.round((100 - allocated) * 10) / 10;
    } else {
      const v = Math.round(((current[id] ?? 0) / othersSum) * rest * 10) / 10;
      out[id] = v;
      allocated += v;
    }
  });
  return out;
}

function gramsFor(count: number, hunger: Hunger, base: number, hours: number): number {
  return count * base * HUNGER_MUL[hunger] * durationMul(hours);
}

function roundKg(n: number): number {
  return Math.round(n * 100) / 100;
}

function charcoalKg(meatKg: number, hours: number, adults: number): number {
  const floor = adults >= 6 ? 3 : 1.5;
  const raw = meatKg * 0.6 * durationMul(hours);
  return roundKg(Math.max(floor, raw));
}

function beerL(drinkers: number, hours: number): number {
  if (drinkers <= 0) return 0;
  const h = Math.min(12, hours);
  return roundKg(Math.max(1, 0.5 * h * drinkers));
}

function sodaL(nonDrinkers: number, hours: number): number {
  if (nonDrinkers <= 0) return 0;
  return roundKg(0.6 * nonDrinkers * durationMul(hours));
}

function waterL(people: number, hours: number): number {
  if (people <= 0) return 0;
  return roundKg(0.3 * people * durationMul(hours));
}

function peopleTotal(input: ChurrascoInput): number {
  return input.homens + input.mulheres + input.criancas;
}

function sideQty(id: SideId, people: number): { quantidade: number; unidade: ListaItem['unidade'] } {
  switch (id) {
    case 'farofa':
      return { quantidade: roundKg(0.05 * people), unidade: 'kg' };
    case 'vinagrete':
      return { quantidade: roundKg(0.04 * people), unidade: 'kg' };
    case 'pao':
      return { quantidade: people, unidade: 'un' };
    case 'gelo':
      return { quantidade: roundKg(0.5 * people), unidade: 'kg' };
    case 'copo':
      return { quantidade: people * 2, unidade: 'un' };
    case 'prato':
      return { quantidade: people, unidade: 'un' };
  }
}

export function calcularLista(input: ChurrascoInput): Lista {
  const people = peopleTotal(input);
  if (people <= 0) return { ok: false, motivo: 'Informa quanta gente vem.' };
  if (input.horas <= 0) return { ok: false, motivo: 'Informa a duração em horas.' };
  if (input.corteIds.length === 0) return { ok: false, motivo: 'Escolhe pelo menos um corte.' };
  if (input.bebidaAlcoolica && (input.quantosBebem < 0 || Number.isNaN(input.quantosBebem))) {
    return { ok: false, motivo: 'Se tem bebida alcoólica, informa quantos bebem.' };
  }
  if (input.bebidaAlcoolica && input.quantosBebem > people) {
    return { ok: false, motivo: 'Quantos bebem não pode passar do total de pessoas.' };
  }

  const carneG =
    gramsFor(input.homens, input.fomeHomem, BASE_G.homem, input.horas) +
    gramsFor(input.mulheres, input.fomeMulher, BASE_G.mulher, input.horas) +
    gramsFor(input.criancas, input.fomeCrianca, BASE_G.crianca, input.horas);
  const carneKg = roundKg(carneG / 1000);

  const percents =
    input.corteIds.length === 1
      ? { [input.corteIds[0]]: 100 }
      : input.corteIds.reduce<Record<string, number>>((acc, id) => {
          acc[id] = input.percentuais[id] ?? 0;
          return acc;
        }, {});
  const pctSum = input.corteIds.reduce((s, id) => s + (percents[id] ?? 0), 0);
  const norm = pctSum > 0 ? pctSum : 100;

  const itens: ListaItem[] = [];
  for (const id of input.corteIds) {
    const nome = CUTS.find((c) => c.id === id)?.nome ?? id;
    const pct = (percents[id] ?? 0) / norm;
    itens.push({
      id,
      nome,
      quantidade: roundKg(carneKg * pct),
      unidade: 'kg',
      secao: 'carne',
    });
  }

  for (const id of input.acompanhamentoIds) {
    const nome = SIDES.find((s) => s.id === id)?.nome ?? id;
    const q = sideQty(id, people);
    itens.push({ id, nome, quantidade: q.quantidade, unidade: q.unidade, secao: 'acompanhamento' });
  }

  itens.push({
    id: 'carvao',
    nome: 'Carvão',
    quantidade: charcoalKg(carneKg, input.horas, input.homens + input.mulheres),
    unidade: 'kg',
    secao: 'carvao',
  });

  if (input.bebidaAlcoolica) {
    itens.push({
      id: 'cerveja',
      nome: 'Cerveja',
      quantidade: beerL(input.quantosBebem, input.horas),
      unidade: 'L',
      secao: 'bebida',
    });
  }

  const drinkers = input.bebidaAlcoolica ? input.quantosBebem : 0;
  const nonDrinkers = people - drinkers;
  if (input.incluirRefrigerante) {
    const quantidade = sodaL(nonDrinkers, input.horas);
    if (quantidade > 0) {
      itens.push({
        id: 'refrigerante',
        nome: 'Refrigerante',
        quantidade,
        unidade: 'L',
        secao: 'bebida',
      });
    }
  }
  if (input.incluirAgua) {
    const quantidade = waterL(people, input.horas);
    if (quantidade > 0) {
      itens.push({
        id: 'agua',
        nome: 'Água',
        quantidade,
        unidade: 'L',
        secao: 'bebida',
      });
    }
  }

  return { ok: true, carneKg, itens };
}

export function isCutId(id: string): id is CutId {
  return CUTS.some((c) => c.id === id);
}
