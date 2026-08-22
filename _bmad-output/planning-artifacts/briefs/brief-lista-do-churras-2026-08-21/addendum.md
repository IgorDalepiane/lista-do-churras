---
title: Lista do Churras — addendum
status: final
created: 2026-08-21
updated: 2026-08-21
---

# Addendum — Lista do Churras

Material que o brief não precisa carregar. Downstream (PRD, arquitetura) lê daqui.

## Restrição técnica (usuário, 2026-08-21)

- **React Native**, não Flutter (o `AGENTS.md` ainda cita Flutter previsto; atualizar no project context quando o Igor pedir).
- V1: **Android PT-BR**. iOS só depois. RN barateia o iOS posterior; não antecipa o V1.
- Chave Pix e preços ficam no aparelho. Sem backend de Pix.

## Locks (fonte: forged-idea.md)

Não reabrir sem o Igor pedir.

- Job: não faltar carne nem sobrar um caminhão. Reviews do Bora matam 400 g fixos.
- V1 pergunta: gente (H/M/criança, digitável), fome (leve / normal / fome), horas (inclui >12 h), cortes com %, quantos bebem cerveja, acompanhamentos (farofa, vinagrete, pão, gelo, copo/prato), carvão com regra que não dê 2 kg para 6 pessoas.
- Recalcular zera. Nunca acumula.
- Preço: usuário cola R$/kg do açougue. App não inventa tabela Brasil.
- Pix: chave do anfitrião no aparelho, divide por N, copia-e-cola. Sem Pix o app serve. Sem kg certo o Pix divide o erro.
- Monetização: grátis + ads + IAP tira anúncio.

## Rejeitado (não volta sem pedido)

- Bora + botão Pix (mesmas 1★)
- Pago na frente
- Pix na nuvem
- Fingir açougue/Swift
- Hinário/CNBB neste app

## Ainda frágil

- Qual kg “certo” sem dados de churrasco real — V1: faixas explícitas; usuário puxa fome para cima (reviews pedem o dobro).
- Rateio Pix quase não foi pedido nas reviews; listing que só fala de Pix morre igual se o cálculo falhar.

## Paisagem (pesquisa leve no brief, não é sizing)

- **Bora Churrasco** (`io.ionic.bora.churras`): âncora. ~100 mil+ na Play, Ionic, atualização de layout em out/2025, site borachurrasco.app, **sem iOS**. Evidência de voz: reviews coladas no forge (Play fetch não trazia comentários).
- Outros calculadores na mesma prateleira: Churrascômetro, Meu Churrasco, Guia Churrasco (este último também tem divisão de conta e comparador de bebida). Split não é o buraco das 1★ do Bora.

## Personas e números (não cabem no brief)

- Evidência do forge: JTBD é vergonha social (não passar fome na frente da mesa), não “fintech de rateio”.
- Direção de UX já anotada no forge (não é spec): stepper de pessoas; carvão 2 kg / 6 pessoas é ofensa.
- Sem persona nomeada além do anfitrião. Sem TAM/SAM.
