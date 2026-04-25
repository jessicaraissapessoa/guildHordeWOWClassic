# Endpoints

## Autenticação e usuários

## POST /auth/register

### Descrição

Cadastra um novo usuário.

### Autenticação

Publico.

### Regras relacionadas

- RN-003 até RN-013
- RN-027

## POST /auth/login

### Descrição

Autentica usuário e retorna JWT.

### Autenticação

Publico.

### Regras relacionadas

- RN-001
- RN-002
- RN-008
- RN-027
- RN-029
- RN-034

## DELETE /users/me

### Descrição

Deleta a propria conta do usuário autenticado.

### Autenticação

Protegido.

### Regras relacionadas

- RN-001
- RN-002
- RN-021
- RN-023
- RN-024
- RN-028
- RN-031
- RN-034

## GET /users

### Descrição

Lista usuários do sistema com filtros opcionais.

### Autenticação

Protegido.

### Query params

- `username`
- `characterName`
- `guildName`
- `guildRank`
- `race`
- `class`
- `roleType`
- `page`
- `pageSize`
- `sortBy`
- `sortOrder`

### Regras relacionadas

- RN-001
- RN-003
- RN-004
- RN-005
- RN-011
- RN-025
- RN-032
- RN-034

## PATCH /users/me/role-type

### Descrição

Altera a função do proprio usuário autenticado.

### Autenticação

Protegido.

### Regras relacionadas

- RN-001
- RN-002
- RN-011
- RN-012
- RN-034

## Guildas

## GET /guilds

### Descrição

Lista todas as guildas cadastradas com paginação e ordenação.

### Autenticação

Protegido.

### Query params

- `page`
- `pageSize`
- `sortBy`
- `sortOrder`

### Regras relacionadas

- RN-001
- RN-026A
- RN-032
- RN-034

## POST /guilds

### Descrição

Cria uma guilda e define o autor como líder.

### Autenticação

Protegido.

### Regras relacionadas

- RN-001
- RN-002
- RN-005
- RN-010
- RN-013
- RN-014
- RN-015
- RN-028
- RN-033
- RN-034

## DELETE /guilds/me

### Descrição

Deleta a guilda do líder autenticado.

### Autenticação

Protegido.

### Regras relacionadas

- RN-001
- RN-002
- RN-016
- RN-021
- RN-022
- RN-024
- RN-028
- RN-031
- RN-033
- RN-034

## GET /guilds/{guildName}/members

### Descrição

Lista os integrantes de uma guilda.

### Autenticação

Protegido.

### Regras relacionadas

- RN-001
- RN-005
- RN-026
- RN-034

## POST /guilds/members

### Descrição

Adiciona usuário existente e sem guilda na guilda do autor.

### Autenticação

Protegido.

### Regras relacionadas

- RN-001
- RN-002
- RN-015
- RN-016
- RN-017
- RN-018
- RN-019
- RN-028
- RN-031
- RN-033
- RN-034

## PATCH /guilds/members/{characterName}/rank

### Descrição

Altera o cargo de um integrante da mesma guilda.

### Autenticação

Protegido.

### Regras relacionadas

- RN-001
- RN-002
- RN-019
- RN-020
- RN-028
- RN-031
- RN-033
- RN-034

## DELETE /guilds/members/{characterName}

### Descrição

Remove integrante da guilda do autor respeitando hierarquia.

### Autenticação

Protegido.

### Regras relacionadas

- RN-001
- RN-002
- RN-016
- RN-019
- RN-028
- RN-031
- RN-033
- RN-034

## POST /guilds/me/leave

### Descrição

Permite que o usuário autenticado saia da guilda atual.

### Autenticação

Protegido.

### Regras relacionadas

- RN-001
- RN-002
- RN-013
- RN-016
- RN-021
- RN-028
- RN-031
- RN-034
