---
title: Lista do Churras — PRD addendum
status: draft
created: 2026-08-21
updated: 2026-08-21
---

# Addendum — PRD Lista do Churras

Como (não o quê). Downstream: arquitetura, UX, épicos.

## Stack

- **React Native**, não Flutter (`AGENTS.md` ainda cita Flutter previsto).
- V1 Android PT-BR. iOS depois. Sem backend de Pix (Pix fora do V1 de qualquer forma).

## Override vs forge

- Forge: Pix era gancho de loja. **Igor, 2026-08-21: Pix fora do V1.**
- Pix na nuvem continua Rejeitado.

## Faixas de partida (frágeis — `[ASSUMPTION]`)

Sem dados de churrasco real. V1 publica a faixa; o Anfitrião puxa Percentual / Nível de Fome.

**Carne base (Nível de Fome médio, Duração ~4 h), por pessoa:**

| Categoria | g |
| --- | --- |
| Homem | 500 |
| Mulher | 350 |
| Criança | 200 |

**Multiplicador Nível de Fome:** pouco 0,75 · médio 1,0 · muito 1,5.

**Multiplicador Duração:** <4 h 0,85 · 4–8 h 1,0 · 8–12 h 1,35 · >12 h 1,6 (teto 2,0 às 16 h).

Carne total = soma por pessoa (base × fome × duração). **Seção de Carnes:** 1 Corte → 100% da Carne. 2+ Cortes → Percentual do Corte soma 100%. Acompanhamentos **não** entram nessa soma. Partilha padrão `[ASSUMPTION]`: partes iguais. Voltar ao Recomendado restaura essa partilha.

**Carvão:** `max(piso, Carne_kg × 0,6 × f_duração)` com piso 3 kg se (Homem+Mulher) ≥ 6; senão piso 1,5 kg. Invariante FR-9: 6 Homem médio 4 h → ≥ 3 kg.

**Bebida Alcoólica:** `[ASSUMPTION]` 0,5 L × Duração × Quantos Bebem (mín. 1 L se Quantos Bebem ≥ 1). V1 pode tratar a categoria como cerveja na prática.

**Acompanhamentos:** quantidades de partida no spec de UX; mesmas regras de Recomendado + Percentual.

## Catálogo de Cortes V1 (`[ASSUMPTION]`)

Picanha, alcatra, maminha, fraldinha, contrafilé, costela, cupim, linguiça, frango, coração, mais “outro” (nome livre).

## Monetização

- Anúncio não cobre kg.
- Preço do IAP: aberto (OQ-5).
