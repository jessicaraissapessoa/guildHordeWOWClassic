# Modelo de Dados

## Entidades

### Usuário

Campos principais:

- `id`
- `username`
- `usernameNormalized`
- `passwordHash`
- `characterName`
- `characterNameNormalized`
- `race`
- `class`
- `roleType`
- `guildId` nullable
- `guildRank` nullable
- `createdAt`
- `updatedAt`

Restricoes:

- `usernameNormalized` unico
- `characterNameNormalized` unico
- `guildRank` so pode existir quando `guildId` existir
- `race`, `class`, `roleType` e `guildRank` limitados aos enums da aplicacao

### Guilda

Campos principais:

- `id`
- `guildName`
- `guildNameNormalized`
- `createdAt`
- `updatedAt`

Restricoes:

- `guildNameNormalized` unico

## Relacionamentos

- Uma guilda possui muitos usuários.
- Um usuário pertence a zero ou uma guilda.

## Indices recomendados

- `users.username_normalized` unique
- `users.character_name_normalized` unique
- `users.guild_id`
- `guilds.guild_name_normalized` unique

## Observacoes de modelagem

- `username`, `characterName` e `guildName` devem preservar o valor de exibicao original.
- A validacao de unicidade deve usar os campos normalizados.
- A regra de combinação valida entre `race`, `class` e `roleType` deve ficar centralizada na camada de dominio/servico.
- Operacoes criticas devem usar transação e revalidacao do estado atual.
