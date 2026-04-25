# guildHordeWOWClassic

API REST para gestão de guildas da Horda em World of Warcraft Classic.

## Status do projeto

O projeto já conta com:

- API implementada em Node.js, Express e MySQL
- autenticação com JWT
- documentação funcional, técnica e de API
- Swagger local em `/api-docs`
- testes unitários
- testes de integração/API
- testes de concorrência
- testes de performance com k6

Item ainda planejado:

- pipeline CI com GitHub Actions

## Funcionalidades

- cadastrar usuário
- fazer login
- criar guilda
- listar guildas
- cadastrar integrante na própria guilda
- alterar a própria função
- alterar cargo de integrante
- remover integrante da guilda
- sair da guilda
- deletar guilda
- listar usuários com filtros, paginação e ordenação
- listar integrantes de uma guilda
- deletar o próprio usuário

## Stack

### Aplicação

- JavaScript
- Node.js
- Express
- MySQL
- mysql2
- jsonwebtoken
- bcrypt

### Documentação

- Swagger/OpenAPI

### Testes

- Mocha
- Chai
- Supertest
- Mochawesome
- k6

## Regras importantes do domínio

- `username`, `characterName` e `guildName` são únicos, com comparação case-insensitive
- enums aceitam caixa variável e ignoram acentuação na entrada
- as combinações de `race + class + roleType` seguem as regras da Horda no WoW Classic
- toda operação protegida revalida o estado atual no banco
- operações críticas usam transação

## Pré-requisitos

- Node.js LTS
- npm
- MySQL local
- k6 instalado para a suíte de performance

## Configuração de ambiente

Arquivos versionados:

- `.env.example`
- `.env.test.example`

Arquivos locais que não devem ser versionados:

- `.env`
- `.env.test`

## Como executar localmente

1. Instale as dependências:

```bash
npm install
```

2. Crie os arquivos locais de ambiente a partir dos exemplos:

- `.env`
- `.env.test`

3. Inicialize o banco principal:

```bash
npm run db:init
```

4. Inicie a API:

```bash
npm run dev
```

Ou:

```bash
npm start
```

## Swagger

Com a API em execução, acesse:

```text
http://localhost:3000/api-docs
```

## Testes

Inicialize o banco de teste:

```bash
npm run db:init:test
```

Execute os testes unitários:

```bash
npm run test:unit
```

Execute os testes de integração/API:

```bash
npm test
```

Gere o relatório HTML dos testes de API:

```bash
npm run test:html
```

Relatório gerado em:

```text
test-reports/mochawesome/api-tests.html
```

Execute os testes de performance:

```bash
npm run test:performance
```

## Estrutura do projeto

```text
src/    aplicação
sql/    schema e inicialização do banco
test/   testes unitários, API, concorrência e performance
docs/   documentação funcional, técnica e de testes
```

## Documentação complementar

- [Visão geral da documentação](docs/README.md)
- [Regras de negócio](docs/produto/regras-de-negocio.md)
- [User stories](docs/produto/user-stories.md)
- [Endpoints](docs/api/endpoints.md)
- [OpenAPI](docs/api/swagger/openapi.yaml)
- [Estratégia de testes](docs/testes/estrategia.md)
- [Casos de teste](docs/testes/casos-de-teste.md)
- [Changelog](docs/tecnico/changelog.md)
