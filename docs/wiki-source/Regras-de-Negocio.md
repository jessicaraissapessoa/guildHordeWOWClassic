# Regras de Negócio

## Regras centrais

- todos os endpoints exigem autenticação, exceto `POST /auth/register` e `POST /auth/login`
- o token identifica o usuário autenticado, mas as permissões efetivas são sempre revalidadas no banco
- `username`, `characterName` e `guildName` são únicos globalmente, com comparação case-insensitive
- campos obrigatórios não aceitam vazio, `null` ou apenas espaços
- senhas seguem política mínima e são armazenadas apenas como hash
- valores de `race`, `class`, `roleType` e `guildRank` são controlados por enum
- a combinação `race + class + roleType` deve ser válida para a Horda no WoW Classic

## Regras de guilda e hierarquia

- usuário sem guilda deve ficar sem cargo
- criação de guilda promove o autor a `Leader`
- um usuário só pode pertencer a uma guilda por vez
- operações de guilda exigem que o autor pertença a uma guilda e cumpra a permissão da ação
- integrante adicionado em guilda entra automaticamente como `Member`
- hierarquia: `Leader > Officer > Member`
- somente `Leader` pode transferir liderança
- `Leader` não pode sair nem se autodeletar enquanto ainda for líder
- somente o `Leader` da própria guilda pode deletá-la

## Segurança e consistência

- senhas nunca devem ser persistidas ou registradas em texto puro
- rotas sensíveis devem aplicar rate limit
- entidades principais devem manter auditoria básica com `createdAt` e `updatedAt`
- falhas de autorização devem bloquear a operação sem efeito colateral
- métodos HTTP não suportados devem responder `405`
- operações concorrentes devem ser atômicas e consistentes

## Referência detalhada

Para a lista completa e rastreável das regras, consulte [docs/produto/regras-de-negocio.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/produto/regras-de-negocio.md).
