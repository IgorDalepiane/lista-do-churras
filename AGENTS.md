<!-- bmad:context -->
<!-- Verified 2026-08-21 against uncommitted bootstrap. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## lista-do-churras

App Android PT-BR (React Native / Expo) para calcular carne, acompanhamentos e custo estimado de um churrasco. Código em `app/`. Planejamento BMad em `_bmad-output/`. Contrato de produto: `_bmad-output/forge/churrascometro-rateio-pix/forged-idea.md` + PRD em `_bmad-output/planning-artifacts/prds/prd-lista-do-churras-2026-08-21/`.

## Policy

- Tratar `forged-idea.md` como lock: não reabrir o que está em Rejeitado sem o Igor pedir.
- Pix **fora do V1** (override 2026-08-21). Pix na nuvem continua Rejeitado.
- Não inventar tabela nacional de preço; o usuário cola R$/kg do açougue.
- Recalcular zera totais. Nunca acumular como o Bora.
- Android PT-BR primeiro. iOS só depois do V1 Android.
- Fome V1 é por categoria (H/M/C), não uma linha por pessoa.

## Where things are

- Skills BMad: `.agents/skills/`
- Config BMad: `_bmad/` (`project_name` = lista-do-churras)
- App Expo: `app/`
- Motor de cálculo (puro, testável): `app/src/domain/`
- Forge: `_bmad-output/forge/churrascometro-rateio-pix/`
- PRD: `_bmad-output/planning-artifacts/prds/prd-lista-do-churras-2026-08-21/`
- Este repo é o app. Não misturar pesquisa de outras ideias de `app-ideas`.

## Known pitfalls

- Pix fora do V1; listing lidera com kg. Sem kg certo, split só divide o erro.
- Fórmula fixa 400g/homem é o que as reviews do Bora matam — V1 precisa de fome, duração e cortes.
- Laboratório de ideias (`app-ideas`) não é este repositório; não commitar pesquisa de outros apps aqui.

<!-- /bmad:context -->
