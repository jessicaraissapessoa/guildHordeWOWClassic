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

Restrições:

- `usernameNormalized` único
- `characterNameNormalized` único
- `guildRank` só pode existir quando `guildId` existir
- `race`, `class`, `roleType` e `guildRank` limitados aos enums da aplicação

### Guilda

Campos principais:

- `id`
- `guildName`
- `guildNameNormalized`
- `createdAt`
- `updatedAt`

Restrições:

- `guildNameNormalized` único

## Relacionamentos

- Uma guilda possui muitos usuários.
- Um usuário pertence a zero ou uma guilda.

## Índices recomendados

- `users.username_normalized` unique
- `users.character_name_normalized` unique
- `users.guild_id`
- `guilds.guild_name_normalized` unique

## Observações de modelagem

- `username`, `characterName` e `guildName` devem preservar o valor de exibição original.
- A validação de unicidade deve usar os campos normalizados.
- A regra de combinação válida entre `race`, `class` e `roleType` deve ficar centralizada na camada de domínio/serviço.
- Operações críticas devem usar transação e revalidação do estado atual.
