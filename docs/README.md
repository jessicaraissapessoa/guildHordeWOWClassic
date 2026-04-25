# Documentação da API

Esta pasta concentra a documentação funcional, técnica e de qualidade da API `guildHordeWOWClassic`.

## Visão geral

- Domínio: sistema de guildas da Horda para World of Warcraft Classic.
- Execução inicial: ambiente local.
- Stack principal: JavaScript, Node.js, Express, MySQL, mysql2, jsonwebtoken, bcrypt, Swagger/OpenAPI, Mocha, Supertest, Chai, Mochawesome e k6.
- GitHub Actions: implementado para CI e performance.

## Estrutura

- [Produto](produto/regras-de-negocio.md): regras de negócio, épicos e user stories.
- [API](api/overview.md): visão geral, autenticação, endpoints, erros e contrato Swagger.
- [Testes](testes/estrategia.md): estratégia, casos de teste e rastreabilidade com testes unitários, integração/API e concorrência.
- [Performance](testes/performance.md): objetivos, escopo inicial e cenários de teste de performance com k6.
- [Técnico](tecnico/requisitos.md): requisitos, modelo de dados, setup e changelog.

## Escopo funcional consolidado

- Cadastro de usuário.
- Login.
- Criação de guilda.
- Listagem de guildas.
- Cadastro de integrante na própria guilda.
- Alteração da própria função.
- Alteração de cargo por líder.
- Remoção de integrante respeitando hierarquia.
- Saída da guilda.
- Deleção da guilda pelo líder.
- Listagem de usuários com filtros, paginação e ordenação.
- Listagem de integrantes de uma guilda.
- Deleção do próprio usuário.

## Padrão de rastreabilidade

Use os identificadores abaixo para conectar os documentos:

- `EP-001`: épico
- `US-001`: user story
- `RN-001`: regra de negócio
- `CT-001`: caso de teste

Fluxo esperado:

```text
EP-001 -> US-001 -> RN-001 -> CT-001 -> teste automatizado
```
