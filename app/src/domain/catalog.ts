import type { CutId, Hunger, SideId } from './types';

export const CUTS: { id: CutId; nome: string }[] = [
  { id: 'picanha', nome: 'Picanha' },
  { id: 'alcatra', nome: 'Alcatra' },
  { id: 'maminha', nome: 'Maminha' },
  { id: 'fraldinha', nome: 'Fraldinha' },
  { id: 'contrafile', nome: 'Contrafilé' },
  { id: 'costela', nome: 'Costela' },
  { id: 'cupim', nome: 'Cupim' },
  { id: 'linguica', nome: 'Linguiça' },
  { id: 'frango', nome: 'Frango' },
  { id: 'coracao', nome: 'Coração' },
];

export const SIDES: { id: SideId; nome: string }[] = [
  { id: 'farofa', nome: 'Farofa' },
  { id: 'vinagrete', nome: 'Vinagrete' },
  { id: 'pao', nome: 'Pão' },
  { id: 'gelo', nome: 'Gelo' },
  { id: 'copo', nome: 'Copo' },
  { id: 'prato', nome: 'Prato' },
];

export const SIDE_FOOD: SideId[] = ['farofa', 'vinagrete', 'pao', 'gelo'];
export const SIDE_DISPOSABLE: SideId[] = ['copo', 'prato'];

export const HUNGER_LABEL: Record<Hunger, string> = {
  pouco: 'Pouco',
  medio: 'Médio',
  muito: 'Muito',
};

export const BASE_G = { homem: 500, mulher: 350, crianca: 200 } as const;
export const HUNGER_MUL: Record<Hunger, number> = {
  pouco: 0.75,
  medio: 1,
  muito: 1.5,
};
