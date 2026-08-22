---
name: Lista do Churras
status: final
created: 2026-08-21
updated: 2026-08-21
sources:
  - _bmad-output/planning-artifacts/prds/prd-lista-do-churras-2026-08-21/prd.md
  - _bmad-output/planning-artifacts/ux-designs/ux-lista-do-churras-2026-08-21/DESIGN.md
---

# EXPERIENCE — Lista do Churras

## Foundation

- Form-factor: Android phone, PT-BR, offline. React Native (Expo).
- Visual: `DESIGN.md`.
- Sem conta. Sem Pix no V1.

## Information Architecture

Única superfície **Montar churrasco** (scroll):

1. Cortes (chips)
2. Acompanhamentos (chips)
3. Bebida alcoólica (liga) → Quantos bebem
4. Pessoas (H/M/C) + fome por categoria + duração
5. Seção de Carnes — % se 2+ cortes + voltar ao recomendado
6. Lista (quantidades)
7. Preço informado opcional → Total estimado
8. Copiar lista
9. Faixa anúncio (abaixo dos números)

## Voice and Tone

Direto, brasileiro, informal sem meme. “Faltou carne” é o medo; a UI não zoa o anfitrião. Microcopy de Recalcular: os números **substituem**, nunca “somar mais”.

## State Patterns

- **Vazio:** 0 pessoas ou 0 cortes → CTA “escolhe a carne e a galera” ; sem Lista.
- **Lista viva:** qualquer mudança de entrada recalcula e **substitui** totais (FR-10).
- **Bebida ligada sem Quantos Bebem:** bloqueia Lista com texto no campo.
- **Preço parcial:** mostra kg; Total só soma itens com preço.

## Interaction Primitives

- Stepper ± e teclado numérico.
- Slider %: ao soltar, rebalanceia os outros cortes para 100%.
- Copiar: clipboard texto PT-BR (vírgula decimal).

## Accessibility Floor

Alvos 48 dp. Contraste creme/carvão. Números não dependem só de cor. Não prender foco no anúncio.

## Key Flows

**UJ-1.** Anfitrião liga picanha + linguiça, 8 homens fome média, 4 h, 4 bebem. Vê kg por corte, carvão ≥ piso, cerveja em L, copia e vai ao açougue.

**UJ-2.** Sobe para 10 homens. Lista antiga some; números novos no mesmo lugar (não 9 kg).
