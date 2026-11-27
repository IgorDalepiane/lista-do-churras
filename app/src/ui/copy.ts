import type { StepId } from './steps';

export const STEP_NAME: Record<StepId, string> = {
  cortes: 'Grelha',
  acompanhamentos: 'Mesa',
  gente: 'Gente',
  fome: 'Fome',
  horas: 'Fogo',
  bebida: 'Cerveja',
  bebem: 'Quem bebe',
  partilha: 'Divisão',
  lista: 'Lista',
};

export const titles: Record<StepId, string> = {
  cortes: 'Escolha os cortes',
  acompanhamentos: 'Escolha os acompanhamentos',
  gente: 'Informe quantas pessoas vêm',
  fome: 'Defina a fome dos convidados',
  horas: 'Defina a duração do churrasco',
  bebida: 'Informe se vai ter cerveja',
  bebem: 'Informe quantos bebem cerveja',
  partilha: 'Divida a carne entre os cortes',
  lista: 'Confira sua lista de compras',
};

export const cta = {
  continue: 'Continuar',
  skipMesa: 'Pular a mesa',
  seeLista: 'Ver a lista',
  copy: 'Copiar lista',
  copied: 'Copiado',
};

export const people = {
  homens: 'Homens',
  mulheres: 'Mulheres',
  criancas: 'Crianças',
  live: (n: number) => `${n} ${n === 1 ? 'pessoa' : 'pessoas'}`,
};

export const hours = {
  adjust: 'Ou ajuste o número',
  about: 'Cerca de',
  ofMeat: 'de carne',
};

export const beer = {
  yes: 'Sim, tem quem bebe',
  no: 'Não, só o churrasco',
  extra: 'Também na lista',
  soda: 'Refrigerante',
  water: 'Água',
};

export const split = {
  reset: 'Dividir por igual',
  total: (kg: string) => `${kg} no total`,
};

export const listaCopy = {
  heroKicker: 'Para levar',
  ofMeat: 'de carne',
  meta: (n: number, h: number) =>
    `${n} ${n === 1 ? 'pessoa' : 'pessoas'} · ${h} h de fogo`,
  privacy: 'Privacidade',
};

export const adsCopy = {
  kicker: 'Compra única',
  title: 'Leva o app',
  body: 'Lista do Churras sem anúncio, na conta da loja. Vale em qualquer aparelho com essa mesma conta. O cálculo continua o mesmo.',
  buy: (price: string) => `Comprar · ${price}`,
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
      body: 'Gente, cortes e quantidades. Essas respostas não são enviadas para a gente. O app funciona sem internet depois de instalado, salvo anúncios, compra na loja e uma checagem de atualização do código quando o aparelho está online.',
    },
    {
      heading: 'Atualizações do app',
      body: 'Se o aparelho estiver online, o app pode perguntar à Expo se existe uma correção de código para baixar, sem passar pela loja. Esse pedido não leva a lista. Sem internet o cálculo usa o que já está no aparelho.',
    },
    {
      heading: 'Anúncios',
      body: 'Na versão grátis, o Google AdMob pode mostrar um anúncio na tela da lista. O anúncio não cobre os kg. Abaixo da lista tem um convite para levar Lista do Churras sem anúncio. O Google pode tratar dados do anúncio conforme a política dele. O formulário de consentimento ou o pedido do sistema aparece quando a lei ou o sistema pede.',
    },
    {
      heading: 'Compra na loja',
      body: 'Lista do Churras sem anúncio é uma compra única na Google Play ou na App Store, ligada à conta dessa loja. Não passa de uma loja para a outra. A loja confirma o pagamento. Neste aparelho o app só guarda um recado local para não mostrar anúncio de novo. Se trocar de celular, use Restaurar compra. O app não cria conta.',
    },
    {
      heading: 'O que a gente não faz',
      body: 'Não criamos conta. Não enviamos suas respostas. Não tem Pix neste app. Não vendemos lista de convidados.',
    },
  ],
};
