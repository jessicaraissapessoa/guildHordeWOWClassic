# Setup

## Premissas

- O projeto será executado inicialmente em ambiente local.
- A API rodará localmente com Node.js e Express.
- O banco será um MySQL local.

## Requisitos

- Node.js LTS instalado
- npm instalado
- MySQL instalado e em execução
- k6 instalado para execução de testes de performance

## Instalação

```bash
npm install
```

Para preparar o banco local principal:

```bash
npm run db:init
```

## Variáveis de ambiente esperadas

Arquivo `.env` para ambiente local:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=guild_horde_wow_classic
DB_USER=root
DB_PASSWORD=root
JWT_SECRET=changeme
JWT_EXPIRES_IN=1h
```

Arquivo `.env.test` para automação:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=guild_horde_wow_classic_test
DB_USER=root
DB_PASSWORD=root
JWT_SECRET=test-secret
JWT_EXPIRES_IN=1h
```

Recomendação:

- versionar apenas `.env.example` e `.env.test.example`
- manter `.env` e `.env.test` fora do Git

## Execução local

Scripts implementados no projeto:

```bash
npm run dev
npm start
```

## Testes automatizados

Inicializar schema do banco de teste:

```bash
npm run db:init:test
```

Executar testes funcionais da API:

```bash
npm test
```

Executar testes unitários:

```bash
npm run test:unit
```

Gerar relatório HTML/JSON dos testes:

```bash
npm run test:html
```

Executar a suíte de performance com k6:

```bash
npm run test:performance
```

## Banco de dados local

Passos práticos:

1. Configurar `.env` e `.env.test`.
2. Executar `npm run db:init` para o banco local principal.
3. Executar `npm run db:init:test` para o banco de testes automatizados.
4. Subir a API com `npm run dev` ou `npm start`.

## Swagger local

O contrato OpenAPI fica em `docs/api/swagger/openapi.yaml` e é servido pela própria API em:

```text
http://localhost:3000/api-docs
```

## Performance local

Os testes de performance são executados com `k6` em suíte separada da suíte funcional. O runner sobe uma instância temporária da API na porta `3010`, com `DISABLE_RATE_LIMIT=true`, para evitar interferência do rate limit de autenticação no preparo dos cenários.
