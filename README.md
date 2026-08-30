# Lista do Churras

Churrascômetro Android PT-BR: quanto comprar de carne, acompanhamentos, carvão e cerveja, o bastante para não faltar nem sobrar um caminhão. O anfitrião cola o R$/kg do açougue dele; o app não inventa tabela nacional de preço.

**Pix fica fora do V1** (override 2026-08-21). O listing lidera com kg.

Grátis, com anúncio na tela da lista. Compra única **Lista do Churras sem anúncio** (`lista_sem_anuncio`) na Google Play ou, depois, na App Store. A compra fica na conta dessa loja, em qualquer aparelho com a mesma conta. Não transfere de uma loja para a outra. Restaurar compra se trocar de celular.

## Onde está o quê

- `app/`: app Expo / React Native
- `app/src/domain/`: motor de cálculo (puro, testável)
- `_bmad-output/`: planejamento (forge, PRD, UX)
- `AGENTS.md`: contrato para agentes neste repo

Contrato de produto: `_bmad-output/forge/churrascometro-rateio-pix/forged-idea.md` e o PRD em `_bmad-output/planning-artifacts/prds/prd-lista-do-churras-2026-08-21/`. O forge ainda cita Pix como gancho de loja; o override do PRD manda: Pix não entra no V1.

## Rodar

Na pasta `app/`:

```sh
bun start          # Expo (dev client)
bun run android    # expo run:android
bun test           # testes do motor em src/domain
```

Android PT-BR primeiro. iOS só depois do V1 Android.
