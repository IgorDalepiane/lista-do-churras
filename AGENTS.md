<!-- bmad:context -->
<!-- Verified 2026-08-21 against uncommitted bootstrap. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## lista-do-churras

App Android PT-BR (Flutter previsto) para calcular carne, acompanhamentos e rateio Pix de um churrasco. Sem código ainda. Planejamento BMad em `_bmad-output/`. Contrato de produto forjado em `_bmad-output/forge/churrascometro-rateio-pix/forged-idea.md`.

## Policy

- Tratar `forged-idea.md` como lock: não reabrir o que está em Rejeitado sem o Igor pedir.
- Não inventar tabela nacional de preço; o usuário cola R$/kg do açougue.
- Chave Pix fica no aparelho. Não enviar Pix para nuvem.
- Recalcular zera totais. Nunca acumular como o Bora.
- Android PT-BR primeiro. iOS só depois do V1 Android.

## Where things are

- Skills BMad: `.agents/skills/`
- Config BMad: `_bmad/` (`project_name` = lista-do-churras)
- Forge deste app: `_bmad-output/forge/churrascometro-rateio-pix/`
- Relatório HTML do forge: `_bmad-output/forge/churrascometro-rateio-pix/forge-report.html`
- Este repo é o app. Não misturar pesquisa de outras ideias de `app-ideas`.

## Known pitfalls

- Pix é gancho da loja, não o job. Sem kg certo o Pix só divide o erro.
- Fórmula fixa 400g/homem é o que as reviews do Bora matam — V1 precisa de fome, duração e cortes.
- Laboratório de ideias (`app-ideas`) não é este repositório; não commitar pesquisa de outros apps aqui.

<!-- /bmad:context -->
