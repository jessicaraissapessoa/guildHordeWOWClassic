# Documentacao da API

Esta pasta concentra a documentacao funcional, tecnica e de qualidade da API `guildHordeWOWClassic`.

## Visao geral

- Dominio: sistema de guildas da Horda para World of Warcraft Classic.
- Execucao inicial: ambiente local.
- Stack principal: JavaScript, Node.js, Express, MySQL, mysql2, jsonwebtoken, bcrypt, Swagger/OpenAPI, Mocha, Supertest, Chai, Mochawesome e GitHub Actions.

## Estrutura

- [Produto](produto/regras-de-negocio.md): regras de negocio, epicos e user stories.
- [API](api/overview.md): visao geral, autenticação, endpoints, erros e contrato Swagger.
- [Testes](testes/estrategia.md): estrategia, casos de teste e rastreabilidade com testes automatizados.
- [Performance](testes/performance.md): objetivos, escopo inicial e cenarios de teste de performance com k6.
- [Tecnico](tecnico/requisitos.md): requisitos, modelo de dados, setup e changelog.

## Escopo funcional consolidado

- Cadastro de usuário.
- Login.
- Criacao de guilda.
- Listagem de guildas.
- Cadastro de integrante na propria guilda.
- Alteração da propria função.
- Alteração de cargo por líder.
- Remocao de integrante respeitando hierarquia.
- Saida da guilda.
- Delecao da guilda pelo líder.
- Listagem de usuários com filtros, paginacao e ordenacao.
- Listagem de integrantes de uma guilda.
- Delecao do proprio usuário.

## Padrao de rastreabilidade

Use os identificadores abaixo para conectar documentos:

- `EP-001`: epico
- `US-001`: user story
- `RN-001`: regra de negocio
- `CT-001`: caso de teste

Fluxo esperado:

```text
EP-001 -> US-001 -> RN-001 -> CT-001 -> teste automatizado
```
