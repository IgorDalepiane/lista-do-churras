---
title: Lista do Churras
status: final
created: 2026-08-21
updated: 2026-08-21
---

# Product Brief: Lista do Churras

## Resumo

Lista do Churras é um app Android em PT-BR que calcula quanto comprar de carne, acompanhamentos, carvão e cerveja para um churrasco — o bastante para não faltar (vergonha) nem sobrar um caminhão (gasto). O anfitrião informa quem come, o quanto estão com fome, quanto tempo dura, quais cortes e o R$/kg do açougue dele. O app devolve uma lista em kg e reais. Rateio Pix (chave no aparelho, divide por N, copia-e-cola) é o gancho da loja, não o produto: sem Pix o app ainda serve; sem kg certo o Pix só divide o erro.

Lançamento indie na Play Store. Nome de trabalho: Lista do Churras.

## O problema

O anfitrião brasileiro precisa acertar a compra antes de ir ao açougue. Errar para baixo é constrangimento na frente da turma. Errar para cima quebra o fim de semana.

O que existe hoje — em especial o Bora Churrasco (~100 mil downloads, sem iOS) — vende “churrascômetro”, mas as 1★ e 3★ não pedem split: pedem kg que não falhe. Fórmula fixa (o clássico 400 g/homem) gera falta, metade do necessário, 150 g ridículo, 8 kg para 8 adultos em 12 h, 53 kg de carvão, e um bug em que recalcular *acumula*. Quem não confia no app chuta, pergunta no grupo ou compra “um pouco a mais”.

Preço nacional inventado também não cola: o Bora recusou valor estimado porque varia por região; ao mesmo tempo tem review pedindo o valor. Sem o R$/kg do açougue local, qualquer rateio é teatro.

## A solução

Um fluxo único, no aparelho, em português:

1. Gente: homens, mulheres, crianças — quantidade digitável.
2. Fome: leve / normal / fome.
3. Duração em horas, inclusive >12 h.
4. Cortes com percentual da compra.
5. Quantos bebem cerveja.
6. Acompanhamentos: farofa, vinagrete, pão, gelo, copo/prato.
7. Carvão com regra que não entregue 2 kg para 6 pessoas.
8. R$/kg (e itens) colados pelo usuário, do açougue dele.
9. Recalcular **zera** totais. Nunca acumula.
10. Opcional: chave Pix do anfitrião só no aparelho → valor por pessoa → copiar.

O resultado é lista de compras + total em R$ + (se quiser) valor do Pix. Faixas de kg são explícitas; o usuário sobe a fome se a turma come o dobro — as reviews pedem isso.

## O que diferencia

Não é o Bora com um botão de Pix. Gancho de loja sem o job (kg) replica as mesmas 1★.

O diferencial honesto é **perguntar o que a fórmula fixa finge saber** (fome, duração, cortes, quem bebe) e **não mentir preço**: sem tabela Brasil, sem fingir açougue/Swift, sem Pix na nuvem. A vantagem é execução no que as reviews já pediram, não um fosso técnico. Listing lidera com cálculo; Pix aparece como “e depois divide no Pix”.

## Quem usa

**Primário — o anfitrião.** Brasileiro, churrasco de fim de semana, ~6–20 pessoas, compra no açougue do bairro, cobra os amigos no Pix. Sucesso para ele: ir ao mercado com lista em kg e reais, não passar vergonha, não voltar com metade da câmara fria.

**Secundário — quem paga ou ajuda a comprar.** Recebe o valor ou a lista. Não precisa de conta no app.

Não é ferramenta de açougue, restaurante ou buffet.

## Sucesso

V1 funcionou se:

- Reviews na Play não repetirem o cluster do Bora (faltou carne, recálculo soma, carvão absurdo).
- O listing e as primeiras telas falarem de kg/lista, não de Pix.
- Anfitrião consegue, num sábado, sair com lista + total + (opcional) valor Pix sem criar conta na nuvem.
- Grátis com anúncio; IAP só para tirar anúncio — receita auxiliar, não a tese do produto.

Ainda frágil (não é critério fingir o contrário): o kg “certo” sem dados de churrasco real. V1 usa faixas explícitas e deixa o usuário puxar fome para cima.

## Escopo

**V1 entra:** o fluxo acima; Android PT-BR; grátis + ads + IAP tira anúncio; tudo local no aparelho.

**V1 não entra:** iOS; Pix na nuvem; paywall na frente; tabela nacional de preço; parceria/fingimento de açougue; hinário/CNBB; clone do Bora + botão Pix.

React Native é restrição de implementação (addendum), não muda o produto.

## Visão

Se o cálculo aguentar review, vira o app que o anfitrião abre *antes* do açougue. iOS depois do V1 Android provar o kg. Calibrar faixas com churrascos reais só quando houver uso — não inventar ciência agora. Pix continua gancho, não rede social de rateio.
