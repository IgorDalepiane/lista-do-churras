---
title: Lista do Churras
status: final
created: 2026-08-21
updated: 2026-08-21
---

# PRD: Lista do Churras

*Nome de trabalho — confirmado no brief.*

## 0. Document Purpose

PRD para o Igor e para UX / arquitetura / épicos. Vocabulário no Glossário. Constrói o brief em `_bmad-output/planning-artifacts/briefs/brief-lista-do-churras-2026-08-21/` e o forge; não os duplica. Sem spec de UX ainda. React Native e faixas numéricas de partida estão no `addendum.md`.

## 1. Vision

App Android PT-BR que calcula quanto comprar de carne, Acompanhamentos, Carvão e (se o Anfitrião ligar) Bebida Alcoólica — o bastante para não faltar nem sobrar um caminhão. O Anfitrião escolhe Cortes e Acompanhamentos, informa pessoas com Nível de Fome de cada uma, Duração, e opcionalmente Preço Informado. O app sugere quantidades; barras de Percentual deixam customizar; voltar ao Recomendado restaura a sugestão. Preço no app é ideia de quanto vai dar; o acerto com nota fiscal fica fora. **Pix não entra no V1.**

## 2. Target User

### 2.1 Jobs To Be Done

- **Funcional:** sair para o açougue com Lista em quantidades (e, se colar Preço Informado, um Total estimado).
- **Social / emocional:** não passar vergonha (faltar carne) nem quebrar o fim de semana (sobrar demais).
- **Não é o job:** fechar conta de cada um no lugar da nota fiscal.

### 2.2 Non-Users (v1)

Açougue, restaurante, buffet. Quem só paga e não organiza. iOS.

### 2.3 Key User Journeys

- **UJ-1. Anfitrião monta a Lista antes do açougue.**
  - **Persona + context:** quem organiza o churrasco. Qualquer pessoa nesse papel. Sem nome de evento; o “tamanho” é a quantidade de pessoas.
  - **Entry state:** abre o app no aparelho, sem conta, sem nuvem.
  - **Path:**
    1. Escolhe Cortes e Acompanhamentos (farofa, vinagrete, pão, gelo, copo/prato). Pode ligar Bebida Alcoólica.
    2. Informa pessoas no seletor Homem / Mulher / Criança. Informa Nível de Fome **por categoria** (muito / médio / pouco). Informa Duração.
    3. Se ligou Bebida Alcoólica, informa Quantos Bebem. Sem esse número, não fecha a Lista.
    4. O app **sugere** a quantidade de cada Item. Com **dois ou mais** Cortes, o Anfitrião ajusta o Percentual do Corte **na Seção de Carnes** (partilha da Carne). Botão Voltar ao Recomendado restaura a partilha sugerida. Um só Corte: 100% da Carne naquele Corte, sem seletor. Acompanhamentos não entram nessa partilha. Não começa digitando o kg.
    5. Vê a Lista. Opcional: cola Preço Informado para o Total estimado.
  - **Climax:** Lista pronta para ir comprar.
  - **Resolution:** leva/copia a Lista; fecha o app. Acerto com nota fiscal é fora.
  - **Edge case:** Recalcular é UJ-2. Sem Pix.

- **UJ-2. Anfitrião Recalcula e a Lista substitui, nunca soma.**
  - **Persona + context:** o mesmo Anfitrião, Lista já existe.
  - **Entry state:** mudou gente, fome, Item, Percentual, Duração ou Quantos Bebem.
  - **Path:** Recalcular zera totais anteriores e gera Lista nova. Percentuais customizados permanecem até voltar ao Recomendado. *[ASSUMPTION: customização sobrevive ao Recalcular.]*
  - **Climax:** quantidades novas **substituem** as antigas (4 kg vira 5 kg, não 9 kg).
  - **Resolution:** segue com a Lista nova.
  - **Edge case:** acumular (bug do Bora) é falha.

- **UJ-3. Rateio Pix.** *Fora do V1.*

## 3. Glossary

- **Anfitrião** — quem organiza o churrasco neste app.
- **Homem / Mulher / Criança** — categorias de pessoa para o cálculo (não identidade legal).
- **Nível de Fome** — muito | médio | pouco, **por categoria** no V1 (Homem / Mulher / Criança). Lista pessoa a pessoa fica para depois.
- **Duração** — horas do churrasco, inclusive >12 h.
- **Corte** — carne escolhida para a grelha.
- **Acompanhamento** — no V1: farofa, vinagrete, pão, gelo, copo, prato.
- **Bebida Alcoólica** — categoria opcional na Lista. Se ligada, Quantos Bebem é obrigatório.
- **Quantos Bebem** — número de pessoas que bebem, informado só se Bebida Alcoólica estiver ligada.
- **Carvão** — kg de carvão na Lista.
- **Item** — linha da Lista (Corte, Acompanhamento, Carvão ou Bebida Alcoólica).
- **Carne** — kg total de proteína calculado a partir das pessoas, Nível de Fome e Duração, **antes** de repartir nos Cortes.
- **Seção de Carnes** — os Cortes ligados. Não inclui Acompanhamento, Carvão nem Bebida Alcoólica.
- **Percentual do Corte** — fração da Carne atribuída a um Corte. Com dois ou mais Cortes, a soma dos Percentuais do Corte é 100%. Com um Corte, 100% implícito (sem seletor).
- **Recomendado** — quantidade que o app sugere para um Item. Na Seção de Carnes, inclui a partilha padrão da Carne entre os Cortes ligados.
- **Voltar ao Recomendado** — na Seção de Carnes, restaura a partilha sugerida dos Percentuais do Corte.
- **Lista** — resultado em quantidades, mais Total estimado se houver Preço Informado.
- **Recalcular** — descarta totais anteriores e recalcula do zero com as entradas atuais.
- **Preço Informado** — R$ por kg ou por unidade que o Anfitrião cola; nunca tabela nacional.
- **Total estimado** — soma em R$ dos Itens com Preço Informado; ideia de quanto vai dar, não dívida.
- **Anúncio** — ad no app grátis.
- **Remover Anúncios** — IAP que tira Anúncio.

## 4. Features

### 4.1 Seleção de Itens

**Description:** O Anfitrião escolhe o que entra na grelha e na mesa **antes** de ver kg. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Escolher Cortes e Acompanhamentos

O Anfitrião pode ligar ou desligar Cortes e Acompanhamentos do V1. Realizes UJ-1.

**Consequences (testable):**
- Com nenhum Corte ligado, o app não apresenta Lista de Carne (pode ainda ter só Acompanhamento / Carvão se fizer sentido — *[ASSUMPTION: pelo menos um Corte é obrigatório para gerar Lista]*).
- Acompanhamentos V1 disponíveis: farofa, vinagrete, pão, gelo, copo, prato.
- Item desligado some da Lista após Recalcular.

#### FR-2: Ligar Bebida Alcoólica

O Anfitrião pode incluir Bebida Alcoólica na Lista. Realizes UJ-1.

**Consequences (testable):**
- Com Bebida Alcoólica desligada, Quantos Bebem não é pedido e a Lista não traz volume de bebida.
- Com Bebida Alcoólica ligada, o Anfitrião **não** consegue gerar/atualizar Lista até informar Quantos Bebem (inteiro ≥ 0).
- Quantos Bebem não pode exceder o total de pessoas (Homem + Mulher + Criança). *[ASSUMPTION: teto = todas as pessoas; Criança pode contar se o Anfitrião quiser — ele é quem informa o número.]*

### 4.2 Pessoas, fome e Duração

**Description:** Tamanho do churrasco é quantidade de pessoas, com fome individual. Realizes UJ-1, UJ-2.

#### FR-3: Seletor Homem / Mulher / Criança

O Anfitrião informa quantas pessoas em cada categoria (digitável e/ou seletor). Realizes UJ-1.

**Consequences (testable):**
- Quantidades são inteiros ≥ 0.
- Total de pessoas = Homem + Mulher + Criança. Sem pessoas (total 0), não gera Lista.

#### FR-4: Nível de Fome por categoria

O Anfitrião atribui Nível de Fome (muito / médio / pouco) a cada categoria Homem / Mulher / Criança. V1 não exige uma linha por pessoa. Realizes UJ-1.

**Consequences (testable):**
- Os 8 Homem compartilham o mesmo Nível de Fome.
- Mudar só o Nível de Fome de Homem, com o resto igual, altera a Carne na Lista (substitui, não acumula).

#### FR-5: Duração

O Anfitrião informa Duração em horas, inclusive valores >12 h. Realizes UJ-1.

**Consequences (testable):**
- Duração > 0.
- Duração maior, com o resto igual, não reduz o Recomendado de Carne. *[ASSUMPTION: fator de Duração é não-decrescente.]*

### 4.3 Recomendado, Percentual e Voltar ao Recomendado

**Description:** O app sugere a Carne; com 2+ Cortes, o Anfitrião parte essa Carne na Seção de Carnes. Realizes UJ-1, UJ-2. Leitura A.

#### FR-6: Sugerir quantidade (não digitar kg primeiro)

O app calcula o Recomendado de cada Item ligado. O Anfitrião não começa o fluxo digitando kg. Realizes UJ-1.

**Consequences (testable):**
- Com as mesmas entradas, o Recomendado é determinístico (mesmos números).
- Faixas usadas no Recomendado são visíveis ou inspecionáveis no app (não caixa-preta). *[ASSUMPTION: um “como calculamos” ou os g/pessoa na UI.]*
- Valores numéricos de partida das faixas: `addendum.md` — ainda frágeis, sem dados de churrasco real.

#### FR-7: Percentual do Corte na Seção de Carnes

Se houver **dois ou mais** Cortes ligados, o Anfitrião informa o Percentual do Corte de cada um, na Seção de Carnes. Realizes UJ-1.

**Consequences (testable):**
- Com exatamente um Corte ligado, não há seletor de Percentual do Corte; aquele Corte recebe 100% da Carne.
- Com dois ou mais Cortes, existe seletor de Percentual do Corte **por Corte**. A soma é 100% da Carne. Farofa/vinagrete/pão/gelo/copo/prato **não** entram nessa soma.
- Mudar o Percentual do Corte de picanha de 50% para 70% **rebalanceia** os demais Cortes na Seção de Carnes para a soma continuar 100% da Carne.
- Carne total (pessoas × fome × Duração) **não** muda só porque o Anfitrião mexeu nos Percentuais do Corte.

#### FR-8: Voltar ao Recomendado (Seção de Carnes)

O Anfitrião restaura a partilha sugerida da Seção de Carnes. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- Após Voltar ao Recomendado, os Percentuais do Corte voltam à partilha padrão do app para os Cortes atualmente ligados. *[ASSUMPTION: padrão = partes iguais.]*
- Customizar de novo depois de restaurar é permitido.

### 4.4 Carvão

**Description:** Carvão entra na Lista com regra que não ofende. Realizes UJ-1.

#### FR-9: Carvão na Lista

O app inclui Carvão no Recomendado. Realizes UJ-1.

**Consequences (testable):**
- Para 6 Homem, Nível de Fome médio, Duração 4 h, Carvão na Lista é **≥ 3 kg** (nunca 2 kg para 6 pessoas).
- Para um grupo grande, Carvão não explode ao absurdo do tipo 53 kg para ~22 Homem. *[ASSUMPTION: teto relativo à Carne; fórmula no addendum.]*

### 4.5 Recalcular

**Description:** Toda Lista nova substitui a anterior. Realizes UJ-2.

#### FR-10: Recalcular zera

O Anfitrião Recalcula após mudar entradas. Realizes UJ-2.

**Consequences (testable):**
- Recalcular com Homem 8 → 10 **substitui** kg; a Carne nova não é a soma da Lista anterior mais um delta aplicado em cima do total velho.
- Não existe modo em que dois Recalcular seguidos com as **mesmas** entradas aumentem a Lista.
- Duas corridas com as mesmas entradas produzem a mesma Lista.

### 4.6 Preço Informado e Total estimado

**Description:** Ideia de quanto vai dar. Realizes UJ-1.

#### FR-11: Colar Preço Informado

O Anfitrião pode informar Preço Informado por Item. Realizes UJ-1.

**Consequences (testable):**
- Sem Preço Informado, a Lista ainda mostra quantidades; Total estimado ausente ou zero de itens precificados.
- O app **não** preenche preço de tabela Brasil / região / açougue fictício.
- Total estimado = soma (quantidade × Preço Informado) só dos Itens com preço. Não é apresentado como valor que cada um deve.

### 4.7 Levar a Lista

#### FR-12: Ver e copiar a Lista

O Anfitrião vê a Lista no aparelho e pode copiá-la. Realizes UJ-1.

**Consequences (testable):**
- Sem criar conta e sem rede obrigatória depois da instalação.
- Copiar coloca texto da Lista no clipboard. *[ASSUMPTION: texto, não imagem.]*

**Out of Scope:**
- Pix, chave, valor por cabeça.

### 4.8 Anúncio e Remover Anúncios

**Description:** Grátis com Anúncio; IAP tira. Brief lock.

#### FR-13: Anúncio no grátis

O Anfitrião no V1 grátis vê Anúncio. Realizes — (não UJ de cálculo).

**Consequences (testable):**
- Anúncio não cobre os números da Lista (kg / Total estimado ilegíveis = falha).
- Remover Anúncios (IAP) remove Anúncio em sessões seguintes neste aparelho. *[ASSUMPTION: persistência local; sem conta.]*

## 5. Non-Goals (Explicit)

- Rateio Pix no V1 (chave, N Pagantes, copia-e-cola). Forge: gancho de loja; **cortado no V1**.
- Pix na nuvem (Rejeitado).
- Fechar conta no lugar da nota fiscal.
- Tabela nacional de preço; fingir açougue/Swift; paywall na frente; iOS; hinário/CNBB; clone Bora + botão Pix.
- Digitar o kg como passo primeiro (Leitura B).

## 6. MVP Scope

### 6.1 In Scope

- UJ-1 e UJ-2. FR-1 a FR-13. Android PT-BR. Tudo no aparelho.

### 6.2 Out of Scope for MVP

- Pix / rateio (adiado, não Rejeitado — exceto Pix na nuvem).
- iOS.
- Conta, nuvem, sync.
- Catálogo infinito de Cortes além do V1. *[ASSUMPTION: catálogo curto + “outro” no addendum.]*

## 7. Success Metrics

**Primary**
- **SM-1:** Nas primeiras reviews da Play, o cluster dominante **não** é “faltou carne”, “recalcular soma” ou “carvão absurdo”. Valida FR-6, FR-9, FR-10.
- **SM-2:** O Anfitrião completa UJ-1 num sábado sem conta. Valida FR-12.

**Secondary**
- **SM-3:** Listing e primeira tela falam de Lista/kg, não de Pix. Valida §5.

**Counter-metrics (do not optimize)**
- **SM-C1:** Não maximizar Carne para “nunca faltar” até virar caminhão. Counterbalances SM-1.
- **SM-C2:** Não maximizar impressões de Anúncio se isso esconder kg. Counterbalances FR-13.

## 8. Open Questions

_Nenhum bloqueante. Decisões do orquestrador (2026-08-21):_

1. Fome V1 = por categoria (não 8 linhas). Pessoa a pessoa adiado.
2. Percentual: pizza só na Seção de Carnes; rebalanceia.
3. Catálogo V1: picanha, alcatra, maminha, fraldinha, contrafilé, costela, cupim, linguiça, frango, coração.
4. Bebida Alcoólica V1 = cerveja, quantidade em litros.
5. IAP R$ 9,90; Anúncio real (AdMob) depois do cálculo sólido — V1 de código mostra faixa “anúncio” sem SDK.

## 9. Assumptions Index

- Customização de Percentual do Corte sobrevive ao Recalcular; Voltar ao Recomendado é que descarta.
- Pelo menos um Corte para gerar Lista.
- Quantos Bebem ≤ total de pessoas.
- Fator de Duração não-decrescente.
- Faixas visíveis no app; números no addendum, frágeis.
- Com 2+ Cortes, soma dos Percentuais do Corte = 100% da Carne; Acompanhamentos fora dessa pizza.
- Partilha padrão da Seção de Carnes = partes iguais, até o Anfitrião mexer.
- Rebalance automático na Seção de Carnes.
- Teto de Carvão relativo à Carne (addendum).
- Copiar Lista = texto.
- IAP persiste no aparelho sem conta.
- Catálogo de Cortes curto + outro.

## Cross-cutting NFRs

- **NFR-1:** Funciona offline após instalar (cálculo, Lista, Preço Informado).
- **NFR-2:** UI e números em pt-BR (vírgula decimal, R$).
- **NFR-3:** Sem conta. Sem enviar Preço Informado para nuvem.
- **NFR-4:** Plataforma V1 = Android. Implementação (React Native) no addendum — não é requisito de produto.
