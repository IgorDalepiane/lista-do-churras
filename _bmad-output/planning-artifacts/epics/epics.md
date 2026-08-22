---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-lista-do-churras-2026-08-21/prd.md
  - _bmad-output/planning-artifacts/ux-designs/ux-lista-do-churras-2026-08-21/EXPERIENCE.md
  - _bmad-output/planning-artifacts/architecture/architecture-lista-do-churras-2026-08-21/ARCHITECTURE-SPINE.md
status: complete
---

# lista-do-churras - Epic Breakdown

## Overview

V1 Android: Lista honesta (kg + total estimado), Recalcular substitui, Pix fora. Motor puro primeiro, depois UI única.

## Requirements Inventory

### Functional Requirements

FR-1 a FR-13 (PRD). Pix UJ-3 fora.

### NonFunctional Requirements

NFR-1 offline, NFR-2 pt-BR, NFR-3 sem conta, NFR-4 Android/Expo.

### FR Coverage Map

| FR | Epic.Story |
| --- | --- |
| FR-6, FR-7, FR-8, FR-9, FR-10 | 1.1 |
| FR-1, FR-2, FR-3, FR-4, FR-5 | 2.1 |
| FR-11, FR-12 | 2.2 |
| FR-13 | 2.2 placeholder |

## Epic List

1. Motor de cálculo — sem UI, testável, nunca acumula.
2. Lista no aparelho — uma tela, PT-BR, copiar, preços opcionais.

## Epic 1: Motor de cálculo

Anfitrião (e os testes) obtêm uma Lista determinística a partir das entradas. Sem React.

### Story 1.1: calcularLista puro

As a Anfitrião (via testes),
I want Carne, Cortes, Acompanhamentos, Carvão e Cerveja calculados sem somar resultado antigo,
So that o kg não mente e o bug do Bora não existe.

**Acceptance:**
- Mesmo input → mesma Lista.
- 6 Homem, médio, 4 h → Carvão ≥ 3 kg.
- 22 Homem não gera ~53 kg de carvão.
- 2+ cortes: % soma 100%; 1 corte: 100%.
- Bebida desligada → sem litros; ligada exige Quantos Bebem.
- Acompanhamentos fora da pizza da carne.
- Testes em `app/src/domain/*.test.ts` passam.

## Epic 2: Lista no aparelho

Uma tela scroll: montar, ver kg, colar preço, copiar.

### Story 2.1: fluxo UJ-1 sem preço

As a Anfitrião,
I want escolher cortes, gente, fome, horas e ver a Lista,
So that eu vou ao açougue sem chute.

**Acceptance:**
- Stepper H/M/C digitável.
- Fome por categoria.
- Chips de cortes e acompanhamentos.
- % só com 2+ cortes; voltar ao recomendado = partes iguais.
- Mudar gente substitui kg (não acumula).
- 0 pessoas ou 0 cortes: sem Lista.
- PT-BR na UI.

### Story 2.2: preço, copiar, faixa de anúncio

As a Anfitrião,
I want colar R$/kg, ver Total estimado e copiar a Lista,
So that eu sei quanto vai dar (não o que cada um me deve).

**Acceptance:**
- Sem preço, Lista ainda mostra kg.
- Sem tabela Brasil.
- Copiar texto pt-BR.
- Faixa anúncio abaixo dos números, sem SDK.
---
