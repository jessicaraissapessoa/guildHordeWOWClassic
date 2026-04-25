# Changelog

Todas as mudanças relevantes da API devem ser registradas aqui.

## [Não lançado]

### Adicionado

- Estrutura inicial de documentação.
- Regras de negócio consolidadas da API.
- Épicos e user stories alinhados ao escopo atual.
- Endpoints documentados conforme a definição funcional.
- Contrato OpenAPI inicial com schemas, enums e segurança.
- Modelo de dados inicial com campos normalizados para unicidade case-insensitive.
- Requisitos técnicos, setup local e estratégia de testes alinhados à stack definida.
- Implementação inicial da API em Node.js, Express e MySQL.
- Exposição local do Swagger em `/api-docs`.
- Script de inicialização de banco em `npm run db:init`.
- Implementação da listagem paginada de guildas.
- Ambiente de teste isolado com `.env.test` e `npm run db:init:test`.
- Arquivo `.env.test.example` e ajuste do `.gitignore` para evitar versionamento de segredos de teste.
- Suíte automatizada de API com Mocha, Supertest, Chai e Mochawesome cobrindo `CT-001` a `CT-047`.
- Suíte de concorrência com cenários concorrentes para criação de guilda, cadastro de integrante, transferência de liderança, remoção e deleção de guilda.
- Suíte de performance com k6 cobrindo `CPT-001` a `CPT-006`.
- Suíte de testes unitários com Mocha e Chai cobrindo normalização, validadores, `AppError`, canonização de enums e regras puras de domínio.
- Runner de performance que sobe uma instância temporária da API na porta `3010`.
- Relatório HTML de testes em `test-reports/mochawesome/api-tests.html`.
- README principal do repositório com visão geral do projeto, setup, testes e links para a documentação complementar.
- Pipelines com GitHub Actions para CI e performance.
- Publicação de artefatos do Mochawesome e dos sumários do k6 no GitHub Actions.

### Alterado

- Normalização de enums para aceitar caixa e acentuação variáveis na entrada e persistir valor canônico.
- Valor canônico da classe `Xamã`.
- Middleware de rate limit para permitir desabilitação controlada em testes de performance.
- Runner de performance para exportar sumários JSON do k6 quando a execução solicitar diretório de resultados.
- Documentação de setup, testes automatizados, estratégia, performance e casos de teste para refletir a cobertura implementada.
- Documentação geral para refletir GitHub Actions como parte implementada da stack do projeto.
