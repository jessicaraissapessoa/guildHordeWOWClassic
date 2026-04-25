# Changelog

Todas as mudancas relevantes da API devem ser registradas aqui.

## [Não lancado]

### Adicionado

- Estrutura inicial de documentacao.
- Regras de negocio consolidadas da API.
- Epicos e user stories alinhados ao escopo atual.
- Endpoints documentados conforme a definicao funcional.
- Contrato OpenAPI inicial com schemas, enums e seguranca.
- Modelo de dados inicial com campos normalizados para unicidade case-insensitive.
- Requisitos tecnicos, setup local e estrategia de testes alinhados a stack definida.
- Implementacao inicial da API em Node.js, Express e MySQL.
- Exposicao local do Swagger em `/api-docs`.
- Script de inicializacao de banco em `npm run db:init`.
- Implementacao da listagem paginada de guildas.
- Ambiente de teste isolado com `.env.test` e `npm run db:init:test`.
- Suite automatizada de API com Mocha, Supertest, Chai e Mochawesome cobrindo `CT-001` a `CT-047`.
- Suite de concorrencia com cenarios concorrentes para criacao de guilda, cadastro de integrante, transferencia de lideranca, remocao e delecao de guilda.
- Suite de performance com k6 cobrindo `CPT-001` a `CPT-006`.
- Runner de performance que sobe uma instancia temporaria da API na porta `3010`.
- Relatorio HTML de testes em `test-reports/mochawesome/api-tests.html`.

### Alterado

- Normalizacao de enums para aceitar caixa e acentuacao variaveis na entrada e persistir valor canonico.
- Valor canonico da classe `Xamã`.
- Middleware de rate limit para permitir desabilitacao controlada em testes de performance.
- Documentacao de setup, testes automatizados, performance e casos de teste para refletir a cobertura implementada.
