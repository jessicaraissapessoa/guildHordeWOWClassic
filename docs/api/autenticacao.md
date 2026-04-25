# Autenticação

## Visão geral

A API usa JWT Bearer Token. O token identifica o usuário autenticado, e as permissões efetivas são revalidadas no banco nas operações protegidas.

## Fluxos

### Cadastro

- Endpoint público: `POST /auth/register`
- Recebe `username`, `password`, `characterName`, `race`, `class` e `roleType`
- Persiste senha somente como hash

### Login

- Endpoint público: `POST /auth/login`
- Recebe `username` e `password`
- Valida credenciais e retorna token JWT

### Acesso a rotas protegidas

- Cliente envia `Authorization: Bearer <token>`
- Middleware valida assinatura e expiração do token
- API extrai o identificador do usuário autenticado
- API consulta o banco para validar existência, guilda atual e cargo atual quando necessário

## Conteúdo mínimo do token

O token deve carregar apenas dados mínimos necessários para identificação, como:

- `sub`: id do usuário
- `username`: username normalizado ou valor original, conforme estratégia técnica

Observação:

- `guildRank` e `guildId` não devem ser fonte única de autorização

## Rotas públicas

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
