# Regras de Negócio

## RN-001 - Recursos protegidos exigem autenticação

### Regra

Todos os endpoints exigem autenticação, exceto cadastro de usuário e login.

### Justificativa

Evitar acesso indevido a dados e operações sensíveis.

### Aplicação

- `POST /auth/register`
- `POST /auth/login`
- Todos os demais endpoints

### Exceções

- `POST /auth/register`
- `POST /auth/login`

## RN-002 - Autorização sempre revalida o estado atual no banco

### Regra

O token identifica o usuário autenticado, mas cargo, guilda e demais permissões devem ser revalidados no banco nas operações protegidas.

### Justificativa

Evitar uso indevido de tokens antigos após mudanças de cargo, guilda ou deleção.

### Aplicação

- Todas as operações protegidas

## RN-003 - Username é único globalmente e case-insensitive

### Regra

`username` deve ser único globalmente, comparado de forma case-insensitive e armazenado com um campo normalizado em lowercase.

### Justificativa

Garantir identificação consistente para login e busca.

### Aplicação

- Cadastro de usuário
- Login
- `GET /users`

## RN-004 - Character name é único globalmente e case-insensitive

### Regra

`characterName` deve ser único globalmente, comparado de forma case-insensitive e armazenado com um campo normalizado.

### Justificativa

Evitar ambiguidade em operações por nome do personagem.

### Aplicação

- Cadastro de usuário
- Cadastro de integrante em guilda
- Alteração de cargo
- Remoção de integrante
- `GET /users`

## RN-005 - Guild name é único globalmente e case-insensitive

### Regra

`guildName` deve ser único globalmente, comparado de forma case-insensitive e armazenado com um campo normalizado após `trim`.

### Justificativa

Evitar duplicidade lógica de guildas com diferença apenas de caixa.

### Aplicação

- Criação de guilda
- Listagem de integrantes por guilda

## RN-006 - Campos obrigatórios não aceitam vazio nem apenas espaços

### Regra

Nenhum campo obrigatório aceita valor vazio, `null`, ou string composta apenas por espaços.

### Justificativa

Garantir integridade dos dados e validações previsíveis.

### Aplicação

- Todos os requests com payload ou query param obrigatório

## RN-007 - Username segue padrão restritivo

### Regra

`username` deve:

- ter entre 3 e 30 caracteres
- começar com letra
- aceitar apenas letras minúsculas, números, ponto e underscore
- não conter espaços
- não terminar com ponto ou underscore
- não conter `..`, `__`, `._` ou `_.`

### Justificativa

Padronizar login e reduzir ambiguidades.

### Aplicação

- Cadastro de usuário
- Busca por `username`

## RN-008 - Senha segue boas práticas e é armazenada com hash

### Regra

A senha deve:

- ter no mínimo 8 caracteres
- conter ao menos 1 letra maiúscula
- conter ao menos 1 letra minúscula
- conter ao menos 1 número
- conter ao menos 1 símbolo
- não conter espaços
- ser armazenada apenas como hash

### Justificativa

Fortalecer a segurança da autenticação.

### Aplicação

- Cadastro de usuário
- Login

## RN-009 - Nome do personagem segue regras do domínio

### Regra

`characterName` deve:

- ter entre 2 e 12 caracteres
- conter apenas letras
- aceitar acentos
- não aceitar números
- não aceitar espaços
- não aceitar símbolos
- representar apenas um nome

### Justificativa

Refletir as regras esperadas do domínio do jogo.

### Aplicação

- Cadastro de usuário

## RN-010 - Nome da guilda segue regras do domínio

### Regra

`guildName` deve:

- ter entre 2 e 24 caracteres após `trim`
- aceitar espaços internos
- ignorar espaços no início e fim
- não aceitar números
- não aceitar símbolos
- não aceitar enfeites visuais

### Justificativa

Padronizar nomes de guilda e evitar entradas inválidas.

### Aplicação

- Criação de guilda
- Busca de integrantes por guilda

## RN-011 - Valores de raça, classe, função e cargo são controlados por enum

### Regra

Os campos `race`, `class`, `roleType` e `guildRank` aceitam somente valores predefinidos. A API aceita entrada em qualquer caixa, ignorando acentuação na interpretação do enum, e persiste o valor canônico.

### Justificativa

Garantir consistência no domínio e facilitar filtros.

### Aplicação

- Cadastro de usuário
- Alteração de função
- Alteração de cargo
- `GET /users`

## RN-012 - Combinação de raça, classe e função deve ser válida

### Regra

Somente as combinações definidas para a Horda em WoW Classic são permitidas:

- Orc: Guerreiro(Tank, DPS), Caçador(DPS), Ladino(DPS), Xamã(Healer, DPS), Bruxo(DPS)
- Tauren: Guerreiro(Tank, DPS), Caçador(DPS), Xamã(Healer, DPS), Druida(Tank, Healer, DPS)
- Troll: Guerreiro(Tank, DPS), Caçador(DPS), Ladino(DPS), Sacerdote(Healer, DPS), Xamã(Healer, DPS), Mago(DPS)
- Morto-vivo: Guerreiro(Tank, DPS), Ladino(DPS), Sacerdote(Healer, DPS), Mago(DPS), Bruxo(DPS)

### Justificativa

Refletir as restrições do domínio do jogo.

### Aplicação

- Cadastro de usuário
- Alteração da própria função

## RN-013 - Usuário sem guilda deve ficar sem cargo

### Regra

Usuário sem guilda deve ter `guildId = null` e `guildRank = null`.

### Justificativa

Evitar cargos desvinculados de guilda.

### Aplicação

- Cadastro de usuário
- Saída da guilda
- Deleção de guilda

## RN-014 - Criação de guilda promove o autor a líder

### Regra

Ao criar uma guilda, o usuário autenticado passa a integrar a guilda criada com cargo `Leader`.

### Justificativa

Toda guilda precisa nascer com um líder.

### Aplicação

- Criação de guilda

## RN-015 - Usuário só pode pertencer a uma guilda por vez

### Regra

Um usuário pode estar vinculado a no máximo uma guilda.

### Justificativa

Preservar a integridade do domínio.

### Aplicação

- Criação de guilda
- Cadastro de integrante
- Saída da guilda
- Deleção de guilda

## RN-016 - Operações de guilda exigem pertencimento do autor a uma guilda

### Regra

Toda operação relacionada a guilda só pode ser executada por usuário autenticado que pertença a uma guilda, além de cumprir a permissão específica da ação.

### Justificativa

Evitar ações inconsistentes por usuários fora de guilda.

### Aplicação

- Cadastro de integrante
- Alteração de cargo
- Remoção de integrante
- Saída da guilda
- Deleção da guilda

## RN-017 - Cadastro de integrante sempre ocorre na guilda do autor

### Regra

O usuário autenticado adiciona integrantes somente na própria guilda, e o alvo precisa existir e não pode estar em outra guilda.

### Justificativa

Evitar associações cruzadas e incoerentes.

### Aplicação

- Cadastro de integrante

## RN-018 - Integrante cadastrado em guilda entra como membro

### Regra

Ao ser adicionado a uma guilda existente, o usuário entra automaticamente com cargo `Member`.

### Justificativa

Padronizar a entrada de novos integrantes.

### Aplicação

- Cadastro de integrante

## RN-019 - Hierarquia de cargos controla alteração e remoção

### Regra

A hierarquia é `Leader > Officer > Member`.

- `Leader` pode alterar cargo para `Officer`, `Member` ou `Leader`
- `Leader` pode remover `Officer` e `Member`
- `Officer` pode cadastrar integrante e remover apenas `Member`
- `Member` não pode cadastrar integrante, alterar cargo ou remover integrantes

### Justificativa

Preservar a cadeia de comando da guilda.

### Aplicação

- Cadastro de integrante
- Alteração de cargo
- Remoção de integrante

## RN-020 - Somente líder pode transferir liderança

### Regra

Somente o líder pode alterar o cargo de um integrante para `Leader`. O alvo deve ser integrante da mesma guilda. Quando isso ocorre, o líder atual passa automaticamente para `Member`.

### Justificativa

Garantir unicidade do líder por guilda.

### Aplicação

- Alteração de cargo

## RN-021 - Líder não pode sair nem se autodeletar enquanto for líder

### Regra

Se o usuário autenticado for líder, ele não pode sair da guilda nem deletar a própria conta enquanto ainda mantiver a liderança. Antes disso, deve transferir a liderança ou deletar a guilda.

### Justificativa

Evitar guildas sem líder.

### Aplicação

- Saída da guilda
- Deleção do próprio usuário

## RN-022 - Guilda pode ser deletada apenas pelo líder

### Regra

Somente o líder da própria guilda pode deletar a guilda. Ao deletar, todos os integrantes passam a ficar com `guildId = null` e `guildRank = null`.

### Justificativa

Garantir governança da guilda e consistência dos membros.

### Aplicação

- Deleção da guilda

## RN-023 - Usuário só pode deletar a própria conta

### Regra

A deleção de usuário exige autenticação e só pode ser executada pelo próprio usuário autenticado.

### Justificativa

Proteger contas de exclusão indevida.

### Aplicação

- Deleção do próprio usuário

## RN-024 - Deletes são hard delete na versão inicial

### Regra

As operações de deleção de usuário e guilda removem definitivamente os registros, sem soft delete.

### Justificativa

Simplificar a primeira versão do projeto.

### Aplicação

- Deleção do próprio usuário
- Deleção da guilda

## RN-025 - Listagem de usuários suporta filtros, paginação e ordenação

### Regra

`GET /users` deve suportar filtros opcionais por `username`, `characterName`, `guildName`, `guildRank`, `race`, `class` e `roleType`, além de paginação e ordenação.

### Justificativa

Permitir tanto busca específica quanto consultas exploratórias.

### Aplicação

- `GET /users`

## RN-026 - Busca de integrantes por guilda é case-insensitive

### Regra

Ao listar integrantes de uma guilda, a identificação da guilda por nome deve ser case-insensitive.

### Justificativa

Manter consistência com a unicidade normalizada de `guildName`.

### Aplicação

- `GET /guilds/{guildName}/members`

## RN-026A - Listagem de guildas suporta paginação e ordenação

### Regra

`GET /guilds` deve listar todas as guildas cadastradas no sistema, exigindo autenticação e suportando paginação e ordenação.

### Justificativa

Permitir consulta global de guildas de forma consistente com a API.

### Aplicação

- `GET /guilds`

## RN-027 - Senhas nunca devem ser persistidas ou registradas em texto puro

### Regra

A senha pode chegar em texto puro na request de cadastro e login, mas não pode ser armazenada, registrada em logs ou retornada em responses.

### Justificativa

Reduzir risco de exposição de credenciais.

### Aplicação

- Cadastro de usuário
- Login
- Logs e auditoria da aplicação

## RN-028 - Operações críticas exigem transação e revalidação

### Regra

Operações críticas devem executar em transação de banco com revalidação do estado atual antes da escrita.

### Justificativa

Reduzir inconsistências por concorrência.

### Aplicação

- Criação de guilda
- Cadastro de integrante
- Alteração de cargo
- Remoção de integrante
- Saída da guilda
- Deleção de guilda
- Deleção de usuário

## RN-029 - A API deve aplicar rate limit

### Regra

Rotas sensíveis, especialmente autenticação, devem ter controle de taxa para reduzir abuso.

### Justificativa

Mitigar força bruta e uso abusivo.

### Aplicação

- Cadastro de usuário
- Login
- Demais rotas conforme estratégia técnica

## RN-030 - A API deve manter auditoria básica

### Regra

Entidades principais devem manter `createdAt` e `updatedAt`.

### Justificativa

Dar rastreabilidade básica ao sistema.

### Aplicação

- Usuários
- Guildas

## RN-031 - Falhas de autorização devem bloquear a operação sem efeito colateral

### Regra

Quando o usuário autenticado não atender aos requisitos de permissão, hierarquia ou pertencimento à guilda exigidos pela operação, a API deve bloquear a ação e não pode produzir alteração parcial de estado.

### Justificativa

Garantir segurança e integridade das regras de acesso.

### Aplicação

- Cadastro de integrante
- Alteração de cargo
- Remoção de integrante
- Saída da guilda
- Deleção da guilda
- Deleção do próprio usuário

## RN-032 - Métodos HTTP não suportados devem ser rejeitados

### Regra

Quando um consumidor chamar uma rota existente com método HTTP não suportado, a API deve responder com `405 Method Not Allowed`.

### Justificativa

Deixar o contrato previsível e evitar uso incorreto dos endpoints.

### Aplicação

- Todos os endpoints da API

## RN-033 - Operações concorrentes devem ser atômicas e consistentes

### Regra

Em cenários concorrentes, a API deve garantir consistência transacional. Quando duas operações conflitantes tentarem alterar o mesmo estado de guilda ou integrante, apenas o fluxo que satisfizer as pré-condições no momento da escrita pode ser concluído; os demais devem falhar sem corromper dados.

### Justificativa

Evitar estados impossíveis, como dois líderes, promoção e remoção simultâneas inconsistentes, ou guilda removida parcialmente.

### Aplicação

- Criação de guilda
- Cadastro de integrante
- Alteração de cargo
- Remoção de integrante
- Saída da guilda
- Deleção de guilda
- Deleção de usuário

## RN-034 - Respostas de erro devem contemplar autenticação, autorização e segurança

### Regra

Chamadas sem token, com token inválido, expirado ou com permissão insuficiente devem retornar códigos coerentes e nunca expor informações sensíveis.

### Justificativa

Padronizar o comportamento da API diante de falhas de segurança.

### Aplicação

- Todos os endpoints protegidos
