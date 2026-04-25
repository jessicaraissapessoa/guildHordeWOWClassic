# Testes Automatizados

## Como executar

Os scripts reais ainda serao implementados, mas a expectativa e ter comandos equivalentes a:

```bash
npm test
npm run test:report
```

## Ferramentas

- `mocha`: runner
- `supertest`: chamadas HTTP para a API
- `chai`: assercoes
- `mochawesome`: relatorio HTML/JSON

Observacao:

- testes de performance devem ficar em suite separada da suite funcional e ser executados com k6.

## Convencoes

- Cada endpoint principal deve ter fluxos de sucesso e erro cobertos.
- Regras de negocio criticas devem ter testes dedicados.
- O nome do teste deve explicitar o comportamento protegido.
- Relatorios do Mochawesome devem ser publicados no pipeline sempre que possivel.
- Testes negativos de seguranca devem cobrir `401`, `403`, `405` e `429` quando aplicavel.
- Testes de concorrencia podem ser executados em suite separada para reduzir flakiness.
- Testes de performance devem registrar baseline, volume de carga e ambiente utilizado.

## Mapeamento inicial

| Caso de teste | Tipo sugerido | Ferramentas |
|---|---|---|
| CT-001 a CT-007 | Integracao/API | Mocha + Supertest + Chai |
| CT-008 a CT-041 | Integracao/API | Mocha + Supertest + Chai |
| CT-042 a CT-046 | Seguranca/API | Mocha + Supertest + Chai |
| CPT-001 a CPT-006 | Performance | k6 |

## Suites recomendadas

- `auth.spec.js`: cadastro, login, rate limit e sigilo de senha
- `users.spec.js`: listagem, filtros, ordenacao, role type e delecao do proprio usuário
- `guilds.spec.js`: listagem, criacao, delecao e listagem de integrantes
- `guild-members.spec.js`: cadastro, alteração de cargo, remocao e saida da guilda
- `security.spec.js`: `401`, `403`, `405`, token expirado e token invalido
- `concurrency.spec.js`: cenarios criticos de disputa concorrente
- `performance/`: cenarios de carga e baseline de performance em k6
