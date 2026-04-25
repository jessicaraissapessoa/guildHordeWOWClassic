# Modelo de Dados

## Entidade Usuário

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
- `guildId`
- `guildRank`
- `createdAt`
- `updatedAt`

Restrições importantes:

- `usernameNormalized` único
- `characterNameNormalized` único
- `guildRank` só existe quando `guildId` existir

## Entidade Guilda

Campos principais:

- `id`
- `guildName`
- `guildNameNormalized`
- `createdAt`
- `updatedAt`

Restrição importante:

- `guildNameNormalized` único

## Relacionamento

- uma guilda possui muitos usuários
- um usuário pertence a zero ou uma guilda

## Observações

- os valores originais de exibição são preservados
- a unicidade usa campos normalizados
- as combinações de domínio válidas ficam centralizadas na camada de serviço
- operações críticas usam transação e revalidação

## Referência detalhada

- [docs/tecnico/modelo-de-dados.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/tecnico/modelo-de-dados.md)
