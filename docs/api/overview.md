# Visao Geral da API

## Objetivo

Disponibilizar uma API REST para cadastro de usuários, autenticação, gestão de guildas e consulta de integrantes no contexto de WoW Classic.

## Stack da API

- Runtime: Node.js
- Linguagem: JavaScript
- Framework: Express
- Banco: MySQL
- Driver: mysql2
- Autenticação: JWT com jsonwebtoken
- Senhas: bcrypt
- Contrato: OpenAPI/Swagger
- Testes: Mocha, Supertest, Chai e Mochawesome

## Padroes gerais

- Formato de dados: JSON
- Charset: UTF-8
- Versão inicial: execucao local
- Autenticação: Bearer token JWT
- Todos os endpoints, exceto cadastro e login, sao protegidos
- Comparacoes de `username`, `characterName` e `guildName` sao case-insensitive
- Valores de enum aceitam qualquer caixa na entrada, ignoram acentuacao na interpretacao e sao persistidos no formato canonico
- Métodos HTTP não suportados em rotas existentes devem retornar `405 Method Not Allowed`
- Operacoes criticas devem ser atomicas e protegidas por transação
- Falhas de autenticação e autorizacao não podem produzir efeito colateral

## Dominios da API

- Autenticação e conta do usuário
- Ciclo de vida da guilda
- Consulta de guildas
- Gestão de integrantes e hierarquia
- Consulta de usuários e integrantes

## Referencias

- Contrato OpenAPI: `docs/api/swagger/openapi.yaml`
- Endpoints descritos em: `docs/api/endpoints.md`
- Regras de negocio em: `docs/produto/regras-de-negocio.md`
- Erros padronizados em: `docs/api/erros.md`
