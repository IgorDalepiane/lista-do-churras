export type Hunger = 'pouco' | 'medio' | 'muito';

export type CutId =
  | 'picanha'
  | 'alcatra'
  | 'maminha'
  | 'fraldinha'
  | 'contrafile'
  | 'costela'
  | 'cupim'
  | 'linguica'
  | 'frango'
  | 'coracao';

export type SideId = 'farofa' | 'vinagrete' | 'pao' | 'gelo' | 'copo' | 'prato';

export type Unit = 'kg' | 'L' | 'un';

export type ListaSecao = 'carne' | 'acompanhamento' | 'carvao' | 'bebida';

export type ChurrascoInput = {
  homens: number;
  mulheres: number;
  criancas: number;
  fomeHomem: Hunger;
  fomeMulher: Hunger;
  fomeCrianca: Hunger;
  horas: number;
  corteIds: CutId[];
  percentuais: Record<string, number>;
  acompanhamentoIds: SideId[];
  bebidaAlcoolica: boolean;
  quantosBebem: number;
  incluirRefrigerante: boolean;
  incluirAgua: boolean;
};

export type ListaItem = {
  id: string;
  nome: string;
  quantidade: number;
  unidade: Unit;
  secao: ListaSecao;
};

export type Lista = {
  ok: true;
  carneKg: number;
  itens: ListaItem[];
} | {
  ok: false;
  motivo: string;
};
