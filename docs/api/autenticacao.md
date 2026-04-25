# Autenticação

## Visao geral

A API usa JWT Bearer Token. O token identifica o usuário autenticado, e as permissoes efetivas sao revalidadas no banco nas operacoes protegidas.

## Fluxos

### Cadastro

- Endpoint publico: `POST /auth/register`
- Recebe `username`, `password`, `characterName`, `race`, `class` e `roleType`
- Persiste senha somente como hash

### Login

- Endpoint publico: `POST /auth/login`
- Recebe `username` e `password`
- Valida credenciais e retorna token JWT

### Acesso a rotas protegidas

- Cliente envia `Authorization: Bearer <token>`
- Middleware valida assinatura e expiracao do token
- API extrai o identificador do usuário autenticado
- API consulta o banco para validar existencia, guilda atual e cargo atual quando necessario

## Conteudo minimo do token

O token deve carregar apenas dados minimos necessarios para identificacao, como:

- `sub`: id do usuário
- `username`: username normalizado ou valor original, conforme estrategia tecnica

Observacao:

- `guildRank` e `guildId` não devem ser fonte unica de autorizacao

## Rotas publicas

- `POST /auth/register`
- `POST /auth/login`

## Rotas protegidas

- `DELETE /users/me`
- `GET /users`
- `GET /guilds`
- `POST /guilds`
- `DELETE /guilds/me`
- `GET /guilds/{guildName}/members`
- `POST /guilds/members`
- `PATCH /users/me/role-type`
- `PATCH /guilds/members/{characterName}/rank`
- `DELETE /guilds/members/{characterName}`
- `POST /guilds/me/leave`
