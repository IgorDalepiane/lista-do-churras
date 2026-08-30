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

## Config (AdMob / IAP)

A fonte da verdade é [`app/app.config.ts`](app/app.config.ts), no git, igual para development, preview e production. App IDs de amostra do Google, SKU `lista_sem_anuncio` e `adsUseTestUnits: true` ficam como constantes no arquivo. Não há variáveis no dashboard do Expo.

O JS lê `extra` em [`app/src/monetization/runtime.ts`](app/src/monetization/runtime.ts). App IDs do AdMob vão no binário nativo: mudar o App ID exige **novo AAB**. O `runtimeVersion` do OTA segue o `version` de [`app/package.json`](app/package.json) (suba esse número quando mudar nativo).

Publicar OTA (production e preview), na pasta `app/`:

```sh
bun eas:update "…"
```

## O que ainda falta (loja / anúncio real)

Ainda **não há conta AdMob**. Enquanto isso, todos os builds usam anúncio de teste. Não envie para a Play um listing de produção com os App IDs de amostra do Google.

- [ ] Conta AdMob + app Android (App ID `ca-app-pub-…~…`) + unidade de banner; App ID iOS quando existir iOS
- [ ] Trocar as constantes de AdMob em `app.config.ts` (`ADS_USE_TEST_UNITS=false` e IDs reais) e gerar **novo AAB**
- [ ] Produto IAP `lista_sem_anuncio` na Play Console (SKU já escolhido; preço e ficha ainda são tarefa da loja)
- [ ] URL pública da política de privacidade (Data safety da Play); o texto dentro do app não substitui essa URL
