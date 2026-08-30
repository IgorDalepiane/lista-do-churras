---
name: Lista do Churras
status: final
created: 2026-08-21
updated: 2026-08-29
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

### Motion

Tokens em `app/src/ui/motion.ts`. Só ease-out; o próximo toque vale na hora (sem `disabled` enquanto anima; sem animação de saída na troca de etapa).

- **Press:** 100ms, escala ~0.97 + opacidade leve nos controles do kit, CTA, presets de hora e ± da partilha. Haptic leve em seleção / ±; haptic de sucesso em Copiar.
- **Chrome:** barra de progresso 200ms. Só a etapa que entra: fade + 10px de slide (avançar pela direita, voltar pela esquerda).
- **Aparecer:** fade 240ms quando o preview de carne, total da linha ou card de total passam a existir (já dentro da etapa). Linhas de fome entram com a etapa, sem fade extra. Hero da Lista: fade + escala 0.98→1 ao chegar. CTA Copiar mergulha no verde de sucesso e volta; a troca de texto continua sendo a confirmação (sem toast).
- **CTA habilitado:** cor interpola cinza→ink; dá para tocar no instante em que a etapa é válida.
- **Reduzir movimento:** sem transforms nem layout motion; mantém borda selecionada, CTA cinza→ink e o rótulo Copiado.
- **Não fazer:** count-up no kg, stagger nas linhas da Lista ou nos tiles de Cortes/Mesa, bounce/spring, swipe entre etapas, animar anúncio ou paywall, intro de splash.

## Accessibility Floor

Alvos 48 dp. Contraste creme/carvão. Números não dependem só de cor. Não prender foco no anúncio.

## Key Flows

**UJ-1.** Anfitrião liga picanha + linguiça, 8 homens fome média, 4 h, 4 bebem. Vê kg por corte, carvão ≥ piso, cerveja em L, copia e vai ao açougue.

**UJ-2.** Sobe para 10 homens. Lista antiga some; números novos no mesmo lugar (não 9 kg).
