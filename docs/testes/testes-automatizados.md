# Testes Automatizados

## Como executar

A suíte automatizada de API já está implementada com banco MySQL de teste separado, e a suíte de performance já está implementada com `k6`.

Antes da primeira execução, inicialize o schema de teste:

```bash
npm run db:init:test
```

Para executar os testes funcionais de API:

```bash
npm test
```

Para executar os testes unitários:

```bash
npm run test:unit
```

Para gerar relatório HTML e JSON com Mochawesome:

```bash
npm run test:html
```

Arquivos gerados:

- `test-reports/mochawesome/api-tests.html`
- `test-reports/mochawesome/api-tests.json`

Observações:

- Execute `npm test` e `npm run test:html` em sequência, não em paralelo, porque ambos usam o mesmo banco de teste isolado.
- Os testes fazem chamadas HTTP simuladas com `Supertest` sobre a aplicação Express.
- O ambiente de teste usa `.env.test` com banco `guild_horde_wow_classic_test`.
- O comando `npm run test:performance` executa em sequência os scripts `k6` dos casos `CPT-001` a `CPT-006`.
- A workflow `CI` do GitHub Actions executa testes unitários e testes de API, publicando o relatório do Mochawesome como artefato.
- A workflow `Performance` do GitHub Actions executa a suíte `k6` e publica os sumários exportados em `k6-results`.

## Estrutura implementada

- `test/setup.js`: hooks globais do Mocha para reset do banco antes de cada teste
- `test/unit/*.spec.js`: suíte unitária das funções puras de domínio e utilitários
- `test/api/helpers/db.js`: reset e fechamento da conexão do banco de teste
- `test/api/helpers/auth.js`: helpers de cadastro, login e cabeçalho Authorization
- `test/api/helpers/factory.js`: fábricas de dados válidos para os cenários
- `test/api/*.spec.js`: suítes funcionais e de segurança por área da API
- `test/performance/run-all.js`: executor sequencial da suíte de performance
- `test/performance/cpt-001-login.js` a `test/performance/cpt-006-deletar-guilda.js`: scripts `k6` por caso de performance

## Cobertura atual

- todos os casos `CT-001` a `CT-047`
- todos os casos `CPT-001` a `CPT-006`
- validadores, normalização e `AppError` cobertos por testes unitários
- cenários de concorrência documentados
- normalização canônica de enums com caixa e acentuação variáveis
- contrato de autenticação e método HTTP indevido

## Ferramentas

- `mocha`: runner
- `supertest`: chamadas HTTP para a API
- `chai`: asserções
- `mochawesome`: relatório HTML/JSON

## Convenções

- Cada endpoint principal deve ter fluxos de sucesso e erro cobertos.
- Regras de negócio críticas devem ter testes dedicados.
- O nome do teste deve explicitar o comportamento protegido.
- Relatórios do Mochawesome devem ser publicados no pipeline sempre que possível.
- Testes negativos de segurança devem cobrir `401`, `403`, `405` e `429` quando aplicável.
- Testes de concorrência podem ser executados em suíte separada para reduzir flakiness.
- Testes de performance devem registrar baseline, volume de carga e ambiente utilizado.

## Mapeamento inicial

| Caso de teste | Tipo sugerido | Ferramentas |
|---|---|---|
| CT-001 a CT-007 | Integração/API | Mocha + Supertest + Chai |
| CT-008 a CT-041 | Integração/API | Mocha + Supertest + Chai |
| CT-042 a CT-047 | Segurança/API | Mocha + Supertest + Chai |
| CPT-001 a CPT-006 | Performance | k6 |

## Suítes implementadas

- `auth.spec.js`: `CT-001` a `CT-007` e `CT-046`
- `unit/normalization.spec.js`, `unit/validators.spec.js` e `unit/app-error.spec.js`: cobertura unitária de utilitários e regras puras
- `guilds.spec.js`: `CT-008`, `CT-009`, `CT-010`, `CT-030`, `CT-031`, `CT-032`, `CT-033` e `CT-039`
- `guild-members.spec.js`: `CT-012` a `CT-029` e `CT-047` para entrada acento-insensitive em cargo
- `users.spec.js`: `CT-035` a `CT-041` e `CT-047` para filtros acento-insensitive
- `security.spec.js`: `CT-042` a `CT-045`
- `concurrency.spec.js`: `CT-011`, `CT-016`, `CT-020`, `CT-026` e `CT-034`
- `performance/cpt-001-login.js` a `performance/cpt-006-deletar-guilda.js`: `CPT-001` a `CPT-006`
