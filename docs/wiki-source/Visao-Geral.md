# Visão Geral

## Objetivo

Disponibilizar uma API REST para cadastro de usuários, autenticação, gestão de guildas e consulta de integrantes no contexto de WoW Classic.

## Stack principal

- linguagem: JavaScript
- runtime: Node.js
- framework: Express
- banco: MySQL
- driver: mysql2
- autenticação: JWT com jsonwebtoken
- hash de senha: bcrypt
- contrato: Swagger/OpenAPI
- testes: Mocha, Chai, Supertest, Mochawesome e k6
- automação: GitHub Actions

## Premissas gerais

- execução inicial em ambiente local
- respostas em JSON
- autenticação Bearer Token nas rotas protegidas
- `username`, `characterName` e `guildName` com comparação case-insensitive
- enums aceitam entrada em qualquer caixa e ignoram acentuação na interpretação
- operações críticas usam transação e revalidação do estado atual no banco

## Domínios da API

- autenticação e conta do usuário
- ciclo de vida da guilda
- gestão de integrantes e hierarquia
- consulta de guildas, usuários e integrantes
