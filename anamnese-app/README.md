# Anamnese Digital (MVP)

Aplicativo web para gestão de fichas de anamnese, com preenchimento digital e captura de assinatura em tela (iPad, smartphone ou navegador). Backend em .NET 8 + Postgres e frontend em React + Tailwind.

## Visão Geral
- Backend: .NET 8 (Minimal API) + EF Core + PostgreSQL
- Frontend: React (Vite) + Tailwind CSS
- Assinatura: desenhada em canvas e salva como Data URL (PNG base64) no banco
- Banco: PostgreSQL local via Docker (ou Supabase, ajustando a connection string)

## Estrutura
- `anamnese-app/backend` — API .NET 8 (EF Core, endpoints mínimos)
- `anamnese-app/frontend` — SPA React + Tailwind (formulário + canvas assinatura)
- `anamnese-app/docker-compose.yml` — Postgres local

## Pré-requisitos
- .NET 8 SDK
- Node.js 18+ e npm
- Docker Desktop (para Postgres local)

## Banco de Dados (Docker)
1. Suba o Postgres local:
   - `docker compose -f anamnese-app/docker-compose.yml up -d`
2. Connection string padrão (dev):
   - `Host=localhost;Port=5432;Database=anamnese;Username=postgres;Password=postgres;`

Se for usar Supabase, substitua a connection string em `anamnese-app/backend/appsettings.json:1` e garanta `sslmode=require` se necessário.

## Backend (.NET)
1. Ajuste a connection string em `anamnese-app/backend/appsettings.json:1` se quiser.
2. Rode a API:
   - `cd anamnese-app/backend`
   - `dotnet restore`
   - `dotnet run`
3. A API sobe por padrão em `http://localhost:5215` (definido em `anamnese-app/backend/Properties/launchSettings.json:1`).
4. Swagger (dev): `http://localhost:5215/swagger`.

Notas:
- Em desenvolvimento, o banco é criado via `EnsureCreated` (sem migrations) para facilitar o start. Para usar migrations, defina `"UseMigrations": true` em `appsettings.json` e crie migrações com `dotnet ef`.

## Frontend (React + Tailwind)
1. Configure o endpoint da API:
   - Copie `anamnese-app/frontend/.env.example:1` para `.env` e ajuste `VITE_API_URL` se necessário.
2. Instale e rode:
   - `cd anamnese-app/frontend`
   - `npm install`
   - `npm run dev`
3. A aplicação abre em `http://localhost:5173`.

## Testar o Fluxo (MVP)
1. Abra `http://localhost:5173` no iPad/smartphone/computador.
2. Preencha os dados da cliente e histórico.
3. Assine no campo de assinatura e clique em “Salvar ficha”.
4. Em caso de sucesso, a página exibirá o ID da ficha criada.

Endpoints principais (ver implementação):
- `POST /api/intakes` — cria cliente + anamnese + assinatura (ver `anamnese-app/backend/Program.cs:1`).
- `GET /api/clients/{id}` — retorna cliente.
- `GET /api/anamneses/{id}` — retorna anamnese com cliente.

## Aviso sobre Assinatura Digital
Este MVP captura a assinatura como imagem (não é assinatura digital com certificado/PKI). Para validade jurídica e integridade, próximos passos envolvem:
- Registro com hash da imagem e metadados (IP, user-agent, timestamp) e selagem de tempo.
- Vincular a um fluxo de confidencialidade (autenticação, consentimento explícito).
- (Opcional) Integração com provedores de assinatura eletrônica com certificação.

## Próximos Passos Sugeridos
- Listagem, busca e edição de clientes/fichas.
- Autenticação (Clínica/Profissional) e perfis de acesso.
- Migração para EF Core (Add-Migration/Update-Database) + versionamento de schema.
- Armazenamento de assinatura em blob (S3/Supabase Storage) ao invés do banco.
- Modelo de atendimento: vincular sessões/procedimentos à ficha.

---

## Referências de Código Úteis
- Backend: `anamnese-app/backend/Program.cs:1` — mapeamento de endpoints e bootstrap.
- Modelos: `anamnese-app/backend/Models/Client.cs:1`, `anamnese-app/backend/Models/Anamnesis.cs:1`.
- DbContext: `anamnese-app/backend/Data/AppDbContext.cs:1`.
- Frontend: `anamnese-app/frontend/src/pages/NewIntakePage.tsx:1` — formulário + envio.
- Assinatura: `anamnese-app/frontend/src/components/SignatureCanvas.tsx:1` — canvas responsivo.
- Docker: `anamnese-app/docker-compose.yml:1` — Postgres local.
