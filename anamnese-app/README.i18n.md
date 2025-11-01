# i18n (Multi-idiomas)

Este projeto agora possui suporte a múltiplos idiomas no frontend e backend.

## Frontend (React)
- Biblioteca: `i18next` + `react-i18next` (carregadas em `src/i18n.ts`).
- Idiomas: `pt-BR` (padrão) e `en-US`.
- Seletor de idioma no cabeçalho (botões Português/Inglês).
- Chaves de exemplo: `app.title`, `nav.home`, `nav.anamnese`, `sidebar.contexts`.

Arquivos relevantes:
- `anamnese-app/frontend/src/i18n.ts:1` – inicialização e recursos.
- `anamnese-app/frontend/src/App.tsx:1` – uso de `useTranslation` e seletor de idioma.
- `anamnese-app/frontend/src/components/Sidebar.tsx:1` – links traduzidos.

## Backend (.NET)
- Localization habilitada com `AddLocalization` e `UseRequestLocalization`.
- Idiomas: `pt-BR` (padrão) e `en-US`.
- Recursos RESX em `anamnese-app/backend/Resources` (`SharedResources.*.resx`).
- Endpoint de exemplo `GET /api/i18n` retorna todas as chaves dos recursos na cultura atual.
  - Para forçar cultura via querystring: `?culture=pt-BR` ou `?culture=en-US`.

Arquivos relevantes:
- `anamnese-app/backend/Program.cs:1` – configuração de localization e endpoint.
- `anamnese-app/backend/SharedResources.cs:1` – classe âncora para os recursos.
- `anamnese-app/backend/Resources/SharedResources.pt-BR.resx:1` – PT-BR.
- `anamnese-app/backend/Resources/SharedResources.en-US.resx:1` – EN-US.

## Rotas (Frontend)
- `/` (Home): corpo em branco com sidebar à esquerda (links traduzidos).
- `/anamnese`: formulário existente de Anamnese.

