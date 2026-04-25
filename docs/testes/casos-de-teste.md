# Casos de Teste

## CT-001 - Cadastrar usuário com sucesso

- User story relacionada: US-001
- Endpoint: `POST /auth/register`
- Resultado esperado: cria usuário com hash de senha, sem guilda e sem cargo

## CT-002 - Bloquear username duplicado

- User story relacionada: US-001
- Endpoint: `POST /auth/register`
- Resultado esperado: retorna `409` ao tentar cadastrar o mesmo `username` normalizado mais de uma vez. Como o campo aceita apenas letras minúsculas, a validação observável ocorre sobre o valor já normalizado

## CT-003 - Bloquear characterName duplicado ignorando caixa

- User story relacionada: US-001
- Endpoint: `POST /auth/register`
- Resultado esperado: retorna `409` ao tentar cadastrar `Goel` e depois `goel`

## CT-004 - Bloquear combinação inválida de raça, classe e função

- User story relacionada: US-001
- Endpoint: `POST /auth/register`
- Resultado esperado: retorna `400` ou `409` conforme estratégia adotada

## CT-005 - Realizar login com sucesso

- User story relacionada: US-002
- Endpoint: `POST /auth/login`
- Resultado esperado: retorna JWT válido

## CT-006 - Rejeitar login com senha inválida

- User story relacionada: US-002
- Endpoint: `POST /auth/login`
- Resultado esperado: retorna `401`

## CT-007 - Aplicar rate limit no login

- User story relacionada: US-002
- Endpoint: `POST /auth/login`
- Resultado esperado: retorna `429` após exceder o limite configurado

## CT-008 - Criar guilda com sucesso

- User story relacionada: US-004
- Endpoint: `POST /guilds`
- Resultado esperado: cria guilda e define autor como `Leader`

## CT-009 - Bloquear criação de guilda com nome duplicado ignorando caixa

- User story relacionada: US-004
- Endpoint: `POST /guilds`
- Resultado esperado: retorna `409`

## CT-010 - Impedir criação de guilda por usuário já vinculado a uma guilda

- User story relacionada: US-004
- Endpoint: `POST /guilds`
- Resultado esperado: retorna `409`

## CT-011 - Garantir consistência em criação concorrente da mesma guilda

- User story relacionada: US-004
- Endpoint: `POST /guilds`
- Resultado esperado: apenas uma requisição cria a guilda e a outra falha sem duplicidade

## CT-012 - Adicionar integrante sem guilda na própria guilda

- User story relacionada: US-008
- Endpoint: `POST /guilds/members`
- Resultado esperado: alvo entra na guilda do autor com cargo `Member`

## CT-013 - Impedir membro de adicionar integrante

- User story relacionada: US-008
- Endpoint: `POST /guilds/members`
- Resultado esperado: retorna `403`

## CT-014 - Impedir usuário sem guilda de adicionar integrante

- User story relacionada: US-008
- Endpoint: `POST /guilds/members`
- Resultado esperado: retorna `403` ou `409`, conforme estratégia adotada

## CT-015 - Impedir adicionar usuário que já pertence a uma guilda

- User story relacionada: US-008
- Endpoint: `POST /guilds/members`
- Resultado esperado: retorna `409`

## CT-016 - Garantir consistência em cadastro concorrente do mesmo integrante

- User story relacionada: US-008
- Endpoint: `POST /guilds/members`
- Resultado esperado: o usuário entra no máximo uma vez em uma única guilda

## CT-017 - Transferir liderança com sucesso

- User story relacionada: US-009
- Endpoint: `PATCH /guilds/members/{characterName}/rank`
- Resultado esperado: alvo vira `Leader` e autor vira `Member`

## CT-018 - Impedir oficial de alterar cargo

- User story relacionada: US-009
- Endpoint: `PATCH /guilds/members/{characterName}/rank`
- Resultado esperado: retorna `403`

## CT-019 - Impedir alterar cargo de integrante de outra guilda

- User story relacionada: US-009
- Endpoint: `PATCH /guilds/members/{characterName}/rank`
- Resultado esperado: retorna `403` ou `404`, conforme estratégia adotada

## CT-020 - Garantir consistência em transferência concorrente de liderança

- User story relacionada: US-009
- Endpoint: `PATCH /guilds/members/{characterName}/rank`
- Resultado esperado: não podem existir dois líderes ao final da disputa concorrente

## CT-021 - Permitir líder remover oficial

- User story relacionada: US-010
- Endpoint: `DELETE /guilds/members/{characterName}`
- Resultado esperado: integrante removido da guilda

## CT-022 - Impedir oficial de remover outro oficial

- User story relacionada: US-010
- Endpoint: `DELETE /guilds/members/{characterName}`
- Resultado esperado: retorna `403`

## CT-023 - Impedir líder de remover a si mesmo

- User story relacionada: US-010
- Endpoint: `DELETE /guilds/members/{characterName}`
- Resultado esperado: retorna `409`

## CT-024 - Impedir membro de remover outro integrante

- User story relacionada: US-010
- Endpoint: `DELETE /guilds/members/{characterName}`
- Resultado esperado: retorna `403`

## CT-025 - Impedir usuário sem guilda de remover integrante

- User story relacionada: US-010
- Endpoint: `DELETE /guilds/members/{characterName}`
- Resultado esperado: retorna `403` ou `409`, conforme estratégia adotada

## CT-026 - Garantir consistência em remoção concorrente e alteração de cargo

- User story relacionada: US-010
- Endpoint: `DELETE /guilds/members/{characterName}`
- Resultado esperado: o estado final do alvo permanece consistente e sem atualização parcial

## CT-027 - Permitir membro sair da guilda

- User story relacionada: US-011
- Endpoint: `POST /guilds/me/leave`
- Resultado esperado: usuário fica com `guildId = null` e `guildRank = null`

## CT-028 - Impedir líder de sair da guilda sem transferir liderança

- User story relacionada: US-011
- Endpoint: `POST /guilds/me/leave`
- Resultado esperado: retorna `409`

## CT-029 - Impedir saída da guilda por usuário sem guilda

- User story relacionada: US-011
- Endpoint: `POST /guilds/me/leave`
- Resultado esperado: retorna `409`

## CT-030 - Listar guildas com sucesso

- User story relacionada: US-005
- Endpoint: `GET /guilds`
- Resultado esperado: retorna lista paginada de guildas com líder atual e quantidade de integrantes

## CT-031 - Validar paginação e ordenação de guildas

- User story relacionada: US-005
- Endpoint: `GET /guilds`
- Resultado esperado: respeita `page`, `pageSize`, `sortBy` e `sortOrder`

## CT-032 - Deletar guilda com sucesso

- User story relacionada: US-006
- Endpoint: `DELETE /guilds/me`
- Resultado esperado: guilda removida e integrantes desvinculados

## CT-033 - Impedir deletar guilda com usuário que não é líder

- User story relacionada: US-006
- Endpoint: `DELETE /guilds/me`
- Resultado esperado: retorna `403`

## CT-034 - Garantir consistência em deleção concorrente da guilda

- User story relacionada: US-006
- Endpoint: `DELETE /guilds/me`
- Resultado esperado: a guilda é removida uma única vez e não restam membros vinculados

## CT-035 - Alterar a própria função com sucesso

- User story relacionada: US-012
- Endpoint: `PATCH /users/me/role-type`
- Resultado esperado: atualiza `roleType` quando a combinação continua válida

## CT-036 - Bloquear alteração da própria função para combinação inválida

- User story relacionada: US-012
- Endpoint: `PATCH /users/me/role-type`
- Resultado esperado: retorna erro de validação ou conflito sem alterar o estado anterior

## CT-037 - Listar usuários com filtros

- User story relacionada: US-013
- Endpoint: `GET /users`
- Resultado esperado: aplica filtros por `class`, `roleType`, `guildName` e demais parâmetros

## CT-038 - Validar paginação e ordenação de usuários

- User story relacionada: US-013
- Endpoint: `GET /users`
- Resultado esperado: respeita `page`, `pageSize`, `sortBy` e `sortOrder`

## CT-039 - Listar integrantes de guilda com busca case-insensitive

- User story relacionada: US-007
- Endpoint: `GET /guilds/{guildName}/members`
- Resultado esperado: `UmaGuilda` e `umaguilda` retornam a mesma guilda

## CT-040 - Deletar o próprio usuário não líder

- User story relacionada: US-003
- Endpoint: `DELETE /users/me`
- Resultado esperado: conta removida com sucesso

## CT-041 - Impedir deleção do próprio usuário enquanto for líder

- User story relacionada: US-003
- Endpoint: `DELETE /users/me`
- Resultado esperado: retorna `409`

## CT-042 - Rejeitar acesso sem token em endpoint protegido

- User story relacionada: US-003, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013
- Endpoint: exemplo base `GET /users`
- Resultado esperado: retorna `401`

## CT-043 - Rejeitar acesso com token inválido

- User story relacionada: US-003, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013
- Endpoint: exemplo base `GET /users`
- Resultado esperado: retorna `401`

## CT-044 - Rejeitar acesso com token expirado

- User story relacionada: US-003, US-005, US-006, US-007, US-008, US-009, US-010, US-011, US-012, US-013
- Endpoint: exemplo base `GET /users`
- Resultado esperado: retorna `401`

## CT-045 - Rejeitar método HTTP indevido em rota existente

- User story relacionada: US-005, US-013
- Endpoint: exemplo `POST /users`
- Resultado esperado: retorna `405`

## CT-046 - Garantir que respostas não exponham senha nem hash

- User story relacionada: US-001, US-002
- Endpoint: `POST /auth/register`, `POST /auth/login`
- Resultado esperado: payloads de resposta e erros não contêm senha nem hash

## CT-047 - Aceitar enums com e sem acentuação na entrada

- User story relacionada: US-001, US-009, US-012, US-013
- Endpoint: `POST /auth/register`, `PATCH /guilds/members/{characterName}/rank`, `PATCH /users/me/role-type`, `GET /users`
- Resultado esperado: entradas como `xamã`, `xamá`, `xama`, `líder` e `lider` são interpretadas corretamente e persistidas/retornadas no valor canônico

## CPT-001 - Medir performance do login sob carga controlada

- Tipo: performance
- Endpoint: `POST /auth/login`
- Resultado esperado: manter tempo de resposta e taxa de erro dentro do baseline definido para ambiente local

## CPT-002 - Medir performance da listagem de usuários com filtros

- Tipo: performance
- Endpoint: `GET /users`
- Resultado esperado: responder de forma estável com paginação, filtros e ordenação sob carga controlada

## CPT-003 - Medir performance da criação de guilda

- Tipo: performance
- Endpoint: `POST /guilds`
- Resultado esperado: manter consistência e sem duplicidade em carga concorrente controlada

## CPT-004 - Medir performance do cadastro de integrante

- Tipo: performance
- Endpoint: `POST /guilds/members`
- Resultado esperado: manter latência aceitável e consistência ao adicionar integrantes sob carga controlada

## CPT-005 - Medir performance da alteração de cargo

- Tipo: performance
- Endpoint: `PATCH /guilds/members/{characterName}/rank`
- Resultado esperado: manter consistência de hierarquia e latência estável em execuções concorrentes controladas

## CPT-006 - Medir performance da deleção de guilda

- Tipo: performance
- Endpoint: `DELETE /guilds/me`
- Resultado esperado: desvincular membros e remover guilda sem degradação severa ou estado inconsistente
