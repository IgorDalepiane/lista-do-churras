---
title: Lista do Churras — PRD addendum
status: draft
created: 2026-08-21
updated: 2026-08-30
---

# Addendum — PRD Lista do Churras

Como (não o quê). Downstream: arquitetura, UX, épicos.

## Stack

- **React Native**, não Flutter (`AGENTS.md` ainda cita Flutter previsto).
- V1 Android PT-BR. iOS depois. Sem backend de Pix (Pix fora do V1 de qualquer forma).

## Override vs forge

- Forge: Pix era gancho de loja. **Igor, 2026-08-21: Pix fora do V1.**
- Pix na nuvem continua Rejeitado.

## Override 2026-08-30 (duração e bebidas)

- **Teto de duração: 12 h.** Counter e `durationMul` clampam. Preset “Virada” é o teto útil. `>12h` do forge/PRD fica de lado neste app.
- **Multiplicador Duração:** `<4 h` 0,85 · interpolação linear de 4 h = 1,0 até 12 h = 1,40 (+5% por hora extra). 4/6/8/12 h deixam de cair no mesmo balde.
- **Cerveja:** sem mudança — `0,5 L × Duração × Quantos Bebem` (mín. 1 L), duração no máximo 12 h.
- **Refrigerante:** opcional, **ligado por padrão**. Base 4 h: `0,6 L × quem não bebe`. Quem bebe cerveja não entra. × `durationMul`. Quantidade 0 some da lista.
- **Água:** opcional, **desligada por padrão**. Se ligada: `0,3 L × pessoas` × `durationMul` (reserva, não hidratação por bebedor).

## Override 2026-11-27 (feedback de teste)

- **Preço Informado e Total estimado saem do app.** A Lista mostra só quantidade. O Total era a ponte para o rateio Pix, que saiu do V1. FR-11 e a parte de preço de FR-12, FR-13, NFR-1 e NFR-3 ficam sem efeito. Se o rateio voltar, o valor a dividir é decisão dele.
- **Acompanhamentos:** entram pão de alho e queijo coalho. `[ASSUMPTION]` 1 un por pessoa cada.
- **Anúncio:** além do banner na Lista, um intersticial na transição para a Lista. Só a partir da segunda vez que a Lista abre na sessão, no máximo um por sessão, nunca na primeira Lista. FR-13 continua: anúncio não cobre kg.
- **Progresso:** respostas e passo ficam salvos no aparelho e voltam depois que o sistema fecha o app. "Começar de novo" apaga. Só entradas são salvas, o cálculo continua derivado (FR-10).
- **Textos:** títulos no imperativo e sem subtítulo nos passos. Só a divisão dos cortes mostra o total de kg embaixo do título.

## Faixas de partida (frágeis — `[ASSUMPTION]`)

Sem dados de churrasco real. V1 publica a faixa; o Anfitrião puxa Percentual / Nível de Fome.

**Carne base (Nível de Fome médio, Duração ~4 h), por pessoa:**

| Categoria | g |
| --- | --- |
| Homem | 500 |
| Mulher | 350 |
| Criança | 200 |

**Multiplicador Nível de Fome:** pouco 0,75 · médio 1,0 · muito 1,5.

**Multiplicador Duração:** ver override 2026-08-30 (teto 12 h, interpolação 4–12).

Carne total = soma por pessoa (base × fome × duração). **Seção de Carnes:** 1 Corte → 100% da Carne. 2+ Cortes → Percentual do Corte soma 100%. Acompanhamentos **não** entram nessa soma. Partilha padrão `[ASSUMPTION]`: partes iguais. Voltar ao Recomendado restaura essa partilha.

**Carvão:** `max(piso, Carne_kg × 0,6 × f_duração)` com piso 3 kg se (Homem+Mulher) ≥ 6; senão piso 1,5 kg. Invariante FR-9: 6 Homem médio 4 h → ≥ 3 kg.

**Bebida Alcoólica:** `[ASSUMPTION]` 0,5 L × Duração × Quantos Bebem (mín. 1 L se Quantos Bebem ≥ 1). V1 pode tratar a categoria como cerveja na prática.

**Acompanhamentos:** quantidades de partida no spec de UX; mesmas regras de Recomendado + Percentual.

## Catálogo de Cortes V1 (`[ASSUMPTION]`)

Picanha, alcatra, maminha, fraldinha, contrafilé, costela, cupim, linguiça, frango, coração, mais “outro” (nome livre).

## Monetização

- Anúncio não cobre kg.
- Preço do IAP: aberto (OQ-5).
