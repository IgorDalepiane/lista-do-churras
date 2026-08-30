import type { StepId } from './steps';

export const STEP_NAME: Record<StepId, string> = {
  cortes: 'Grelha',
  acompanhamentos: 'Mesa',
  gente: 'Gente',
  fome: 'Fome',
  horas: 'Fogo',
  bebida: 'Cerveja',
  bebem: 'Quem bebe',
  partilha: 'Partilha',
  lista: 'Lista',
};

export const titles: Record<StepId, string> = {
  cortes: 'O que vai para a grelha?',
  acompanhamentos: 'E na mesa?',
  gente: 'Quem vem?',
  fome: 'Como está a fome?',
  horas: 'Quanto tempo de fogo?',
  bebida: 'Vai ter cerveja?',
  bebem: 'Quantos bebem?',
  partilha: 'Como parte a carne?',
  lista: 'Sua lista',
};

export function corteSub(count: number): string {
  if (count === 0) return 'Escolhe os cortes. A quantidade aparece no fim.';
  return `${count} corte${count > 1 ? 's' : ''}. A quantidade aparece no fim.`;
}

export function mesaSub(count: number): string {
  if (count === 0) return 'O que mais entra na lista — comida e descartável. Pode pular.';
  return `${count} item${count > 1 ? 's' : ''} fora da grelha.`;
}

export const sub = {
  gente: 'Quantas pessoas vêm.',
  fome: 'Um nível para cada grupo que vem.',
  horas: 'Quanto mais tempo, mais carne.',
  bebida: 'Se sim, na próxima pergunta a gente pergunta quantos bebem.',
  partilha: 'Como divide o kg entre os cortes.',
  lista: 'O que comprar. Preço é opcional.',
};

export function bebemSub(people: number): string {
  const n = people === 1 ? '1 pessoa' : `${people} pessoas`;
  return `Até ${n}.`;
}

export const cta = {
  continue: 'Continuar',
  skipMesa: 'Pular a mesa',
  seeLista: 'Ver a lista',
  copy: 'Copiar lista',
  copied: 'Copiado',
};

export const mesaGroups = {
  food: 'Para comer',
  disposable: 'Descartáveis',
};

export const people = {
  homens: 'Homens',
  mulheres: 'Mulheres',
  criancas: 'Crianças',
  live: (n: number) => `${n} ${n === 1 ? 'pessoa' : 'pessoas'}`,
  adultsOnly: (n: number) => `Usar só os adultos (${n})`,
};

export const hours = {
  adjust: 'Ou ajuste o número',
  about: 'Cerca de',
  ofMeat: 'de carne',
};

export const beer = {
  yes: 'Sim, tem quem bebe',
  yesHint: (n: number) => `${n} ${n === 1 ? 'pessoa' : 'pessoas'} no total`,
  no: 'Não, só o churrasco',
  noHint: 'A lista fica sem litro de cerveja',
};

export const split = {
  reset: 'Voltar ao recomendado (partilha igual)',
};

export const listaCopy = {
  heroKicker: 'Para levar',
  ofMeat: 'de carne',
  meta: (n: number, h: number) =>
    `${n} ${n === 1 ? 'pessoa' : 'pessoas'} · ${h} h de fogo`,
  pricedOf: (n: number, total: number) => `${n} de ${total} com preço`,
  total: (money: string) => `Total estimado ${money}`,
  totalHint: 'Ideia de quanto vai dar — não a conta de cada um.',
  noPrices: 'Sem preço a lista ainda serve: é o que comprar.',
  privacy: 'Privacidade',
};

export const adsCopy = {
  failTitle: 'O anúncio não carregou.',
  failBody: 'Se quiser ajudar o app a continuar de graça, tira os anúncios.',
  remove: (price: string) => `Remover anúncios — ${price}`,
  restore: 'Restaurar compra',
  defaultPrice: 'R$ 9,90',
};

export const privacy = {
  title: 'Privacidade',
  intro:
    'Lista do Churras calcula a compra do churrasco no seu aparelho. Não tem conta e não tem nuvem de lista.',
  sections: [
    {
      heading: 'O que fica no aparelho',
      body: 'Gente, cortes, quantidades e os preços que você cola. Esses números não são enviados para a gente. O app funciona sem internet depois de instalado, salvo anúncios e compra na loja.',
    },
    {
      heading: 'Anúncios',
      body: 'Na versão grátis, o Google AdMob pode mostrar um anúncio na tela da lista. O anúncio não cobre os kg. Se o anúncio não carregar, aparece um convite para tirar anúncios. O Google pode tratar dados do anúncio conforme a política dele; o formulário de consentimento aparece quando a lei pede.',
    },
    {
      heading: 'Compra na Play',
      body: 'Remover anúncios é uma compra única na Google Play. A Play confirma o pagamento. Guardamos só no aparelho se a compra já foi feita, para não mostrar anúncio de novo.',
    },
    {
      heading: 'O que a gente não faz',
      body: 'Não criamos conta. Não enviamos seus preços de açougue. Não tem Pix neste app. Não vendemos lista de convidados.',
    },
  ],
};
