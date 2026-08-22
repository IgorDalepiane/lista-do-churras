---
name: Lista do Churras
description: Churrascômetro Android PT-BR. Fluxo por etapas, cards, kg no fim.
status: final
created: 2026-08-21
updated: 2026-08-21
colors:
  surface-base: '#F4F1EC'
  surface-raised: '#FFFFFF'
  ink-primary: '#1C1917'
  ink-secondary: '#8A8178'
  accent: '#E04F16'
  accent-soft: '#FFE8DC'
  navy: '#1A2B4C'
  success: '#2A9D8F'
  border-hairline: '#E7E1D8'
  ad-slot: '#E7E1D8'
typography:
  title:
    note: 'Pergunta da etapa — 28 / extra bold'
  body:
    note: 'Subtítulo muted 16'
  meta:
    note: 'Contagem de passo e dicas'
rounded:
  sm: 12px
  md: 20px
  pill: 999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
---

## Brand & Style

Onboarding de um sábado: uma pergunta por tela, fundo areia, cards brancos, CTA pílula preta. Acento terracota (`#E04F16`) — brasa sem carvão. Ícones em pastéis (azul, coral, teal, âmbar). Continuar só habilita quando a etapa está válida. Lista e kg são a última etapa; anúncio abaixo dos números.

## Colors

- **Areia (`#F4F1EC`)** — tela.
- **Branco** — cards e pílulas.
- **Ink (`#1C1917`)** — título, CTA, borda do card selecionado.
- **Terracota (`#E04F16`)** — progresso, rádio ativo, kg.
- Evitar fundo preto e azul de banco.

## Layout & Spacing

Wizard com barra de progresso. Grid 2 colunas para cortes e acompanhamentos. Rádios pílula para bebida e fome. Stepper circular para gente e horas.

## Components

- SelectCard (grid, ícone pastel, texto cinza se off).
- Radio pílula.
- Counter ± digitável.
- Continuar pílula full-width; desabilitado cinza.
- Faixa anúncio só na tela da Lista.
