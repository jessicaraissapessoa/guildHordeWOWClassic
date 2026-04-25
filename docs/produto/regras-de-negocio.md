# Regras de Negocio

## RN-001 - Recursos protegidos exigem autenticação

### Regra

Todos os endpoints exigem autenticação, exceto cadastro de usuário e login.

### Justificativa

Evitar acesso indevido a dados e operacoes sensiveis.

### Aplicacao

- `POST /auth/register`
- `POST /auth/login`
- Todos os demais endpoints

### Excecoes

- `POST /auth/register`
- `POST /auth/login`

## RN-002 - Autorizacao sempre revalida o estado atual no banco

### Regra

O token identifica o usuário autenticado, mas cargo, guilda e demais permissoes devem ser revalidados no banco nas operacoes protegidas.

### Justificativa

Evitar uso indevido de tokens antigos apos mudancas de cargo, guilda ou delecao.

### Aplicacao

- Todas as operacoes protegidas

## RN-003 - Username e unico globalmente e case-insensitive

### Regra

`username` deve ser unico globalmente, comparado de forma case-insensitive e armazenado com um campo normalizado em lowercase.

### Justificativa

Garantir identificacao consistente para login e busca.

### Aplicacao

- Cadastro de usuário
- Login
- `GET /users`

## RN-004 - Character name e unico globalmente e case-insensitive

### Regra

`characterName` deve ser unico globalmente, comparado de forma case-insensitive e armazenado com um campo normalizado.

### Justificativa

Evitar ambiguidade em operacoes por nome do personagem.

### Aplicacao

- Cadastro de usuário
- Cadastro de integrante em guilda
- Alteração de cargo
- Remocao de integrante
- `GET /users`

## RN-005 - Guild name e unico globalmente e case-insensitive

### Regra

`guildName` deve ser unico globalmente, comparado de forma case-insensitive e armazenado com um campo normalizado apos `trim`.

### Justificativa

Evitar duplicidade logica de guildas com diferenca apenas de caixa.

### Aplicacao

- Criacao de guilda
- Listagem de integrantes por guilda

## RN-006 - Campos obrigatorios não aceitam vazio nem apenas espacos

### Regra

Nenhum campo obrigatorio aceita valor vazio, `null`, ou string composta apenas por espacos.

### Justificativa

Garantir integridade dos dados e validacoes previsiveis.

### Aplicacao

- Todos os requests com payload ou query param obrigatorio

## RN-007 - Username segue padrao restritivo

### Regra

`username` deve:

- ter entre 3 e 30 caracteres
- comecar com letra
- aceitar apenas letras minusculas, numeros, ponto e underscore
- não conter espacos
- não terminar com ponto ou underscore
- não conter `..`, `__`, `._` ou `_.`

### Justificativa

Padronizar login e reduzir ambiguidades.

### Aplicacao

- Cadastro de usuário
- Busca por `username`

## RN-008 - Senha segue boas praticas e e armazenada com hash

### Regra

A senha deve:

- ter no minimo 8 caracteres
- conter ao menos 1 letra maiuscula
- conter ao menos 1 letra minuscula
- conter ao menos 1 numero
- conter ao menos 1 símbolo
- não conter espacos
- ser armazenada apenas como hash

### Justificativa

Fortalecer seguranca da autenticação.

### Aplicacao

- Cadastro de usuário
- Login

## RN-009 - Nome do personagem segue regras do dominio

### Regra

`characterName` deve:

- ter entre 2 e 12 caracteres
- conter apenas letras
- aceitar acentos
- não aceitar numeros
- não aceitar espacos
- não aceitar símbolos
- representar apenas um nome

### Justificativa

Refletir as regras esperadas do dominio do jogo.

### Aplicacao

- Cadastro de usuário

## RN-010 - Nome da guilda segue regras do dominio

### Regra

`guildName` deve:

- ter entre 2 e 24 caracteres apos `trim`
- aceitar espacos internos
- ignorar espacos no inicio e fim
- não aceitar numeros
- não aceitar símbolos
- não aceitar enfeites visuais

### Justificativa

Padronizar nomes de guilda e evitar entradas invalidas.

### Aplicacao

- Criacao de guilda
- Busca de integrantes por guilda

## RN-011 - Valores de raça, classe, função e cargo sao controlados por enum

### Regra

Os campos `race`, `class`, `roleType` e `guildRank` aceitam somente valores pre-definidos. A API aceita entrada em qualquer caixa, ignorando acentuacao na interpretacao do enum, e persiste o valor canonico.

### Justificativa

Garantir consistencia no dominio e facilitar filtros.

### Aplicacao

- Cadastro de usuário
- Alteração de função
- Alteração de cargo
- `GET /users`

## RN-012 - Combinação de raça, classe e função deve ser valida

### Regra

Somente as combinacoes definidas para a Horda em WoW Classic sao permitidas:

- Orc: Guerreiro(Tank, DPS), Cacador(DPS), Ladino(DPS), Xamã(Healer, DPS), Bruxo(DPS)
- Tauren: Guerreiro(Tank, DPS), Cacador(DPS), Xamã(Healer, DPS), Druida(Tank, Healer, DPS)
- Troll: Guerreiro(Tank, DPS), Cacador(DPS), Ladino(DPS), Sacerdote(Healer, DPS), Xamã(Healer, DPS), Mago(DPS)
- Morto-vivo: Guerreiro(Tank, DPS), Ladino(DPS), Sacerdote(Healer, DPS), Mago(DPS), Bruxo(DPS)

### Justificativa

Refletir as restricoes do dominio do jogo.

### Aplicacao

- Cadastro de usuário
- Alteração da propria função

## RN-013 - Usuário sem guilda deve ficar sem cargo

### Regra

Usuário sem guilda deve ter `guildId = null` e `guildRank = null`.

### Justificativa

Evitar cargos desvinculados de guilda.

### Aplicacao

- Cadastro de usuário
- Saida da guilda
- Delecao de guilda

## RN-014 - Criacao de guilda promove o autor a líder

### Regra

Ao criar uma guilda, o usuário autenticado passa a integrar a guilda criada com cargo `Leader`.

### Justificativa

Toda guilda precisa nascer com um líder.

### Aplicacao

- Criacao de guilda

## RN-015 - Usuário so pode pertencer a uma guilda por vez

### Regra

Um usuário pode estar vinculado a no maximo uma guilda.

### Justificativa

Preservar integridade do dominio.

### Aplicacao

- Criacao de guilda
- Cadastro de integrante
- Saida da guilda
- Delecao de guilda

## RN-016 - Operacoes de guilda exigem pertencimento do autor a uma guilda

### Regra

Toda operacao relacionada a guilda so pode ser executada por usuário autenticado que pertença a uma guilda, alem de cumprir a permissao especifica da acao.

### Justificativa

Evitar acoes inconsistentes por usuários fora de guilda.

### Aplicacao

- Cadastro de integrante
- Alteração de cargo
- Remocao de integrante
- Saida da guilda
- Delecao da guilda

## RN-017 - Cadastro de integrante sempre ocorre na guilda do autor

### Regra

O usuário autenticado adiciona integrantes somente na propria guilda, e o alvo precisa existir e não pode estar em outra guilda.

### Justificativa

Evitar associacoes cruzadas e incoerentes.

### Aplicacao

- Cadastro de integrante

## RN-018 - Integrante cadastrado em guilda entra como membro

### Regra

Ao ser adicionado a uma guilda existente, o usuário entra automaticamente com cargo `Member`.

### Justificativa

Padronizar a entrada de novos integrantes.

### Aplicacao

- Cadastro de integrante

## RN-019 - Hierarquia de cargos controla alteração e remocao

### Regra

A hierarquia e `Leader > Officer > Member`.

- `Leader` pode alterar cargo para `Officer`, `Member` ou `Leader`
- `Leader` pode remover `Officer` e `Member`
- `Officer` pode cadastrar integrante e remover apenas `Member`
- `Member` não pode cadastrar integrante, alterar cargo ou remover integrantes

### Justificativa

Preservar a cadeia de comando da guilda.

### Aplicacao

- Cadastro de integrante
- Alteração de cargo
- Remocao de integrante

## RN-020 - Somente líder pode transferir lideranca

### Regra

Somente o líder pode alterar o cargo de um integrante para `Leader`. O alvo deve ser integrante da mesma guilda. Quando isso ocorre, o líder atual passa automaticamente para `Member`.

### Justificativa

Garantir unicidade do líder por guilda.

### Aplicacao

- Alteração de cargo

## RN-021 - Líder não pode sair nem se autodeletar enquanto for líder

### Regra

Se o usuário autenticado for líder, ele não pode sair da guilda nem deletar a propria conta enquanto ainda mantiver a lideranca. Antes disso, deve transferir a lideranca ou deletar a guilda.

### Justificativa

Evitar guildas sem líder.

### Aplicacao

- Saida da guilda
- Delecao do proprio usuário

## RN-022 - Guilda pode ser deletada apenas pelo líder

### Regra

Somente o líder da propria guilda pode deletar a guilda. Ao deletar, todos os integrantes passam a ficar com `guildId = null` e `guildRank = null`.

### Justificativa

Garantir governanca da guilda e consistencia dos membros.

### Aplicacao

- Delecao da guilda

## RN-023 - Usuário so pode deletar a propria conta

### Regra

A delecao de usuário exige autenticação e so pode ser executada pelo proprio usuário autenticado.

### Justificativa

Proteger contas de exclusao indevida.

### Aplicacao

- Delecao do proprio usuário

## RN-024 - Deletes sao hard delete na versão inicial

### Regra

As operacoes de delecao de usuário e guilda removem definitivamente os registros, sem soft delete.

### Justificativa

Simplificar a primeira versão do projeto.

### Aplicacao

- Delecao do proprio usuário
- Delecao da guilda

## RN-025 - Listagem de usuários suporta filtros, paginacao e ordenacao

### Regra

`GET /users` deve suportar filtros opcionais por `username`, `characterName`, `guildName`, `guildRank`, `race`, `class` e `roleType`, alem de paginacao e ordenacao.

### Justificativa

Permitir tanto busca especifica quanto consultas exploratorias.

### Aplicacao

- `GET /users`

## RN-026 - Busca de integrantes por guilda e case-insensitive

### Regra

Ao listar integrantes de uma guilda, a identificacao da guilda por nome deve ser case-insensitive.

### Justificativa

Manter consistencia com a unicidade normalizada de `guildName`.

### Aplicacao

- `GET /guilds/{guildName}/members`

## RN-026A - Listagem de guildas suporta paginacao e ordenacao

### Regra

`GET /guilds` deve listar todas as guildas cadastradas no sistema, exigindo autenticacao e suportando paginacao e ordenacao.

### Justificativa

Permitir consulta global de guildas de forma consistente com a API.

### Aplicacao

- `GET /guilds`

## RN-027 - Senhas nunca devem ser persistidas ou logadas em texto puro

### Regra

A senha pode chegar em texto puro na request de cadastro e login, mas não pode ser armazenada, logada ou retornada em responses.

### Justificativa

Reduzir risco de exposicao de credenciais.

### Aplicacao

- Cadastro de usuário
- Login
- Logs e auditoria da aplicacao

## RN-028 - Operacoes criticas exigem transação e revalidacao

### Regra

Operacoes criticas devem executar em transação de banco com revalidacao do estado atual antes da escrita.

### Justificativa

Reduzir inconsistencias por concorrencia.

### Aplicacao

- Criacao de guilda
- Cadastro de integrante
- Alteração de cargo
- Remocao de integrante
- Saida da guilda
- Delecao de guilda
- Delecao de usuário

## RN-029 - A API deve aplicar rate limit

### Regra

Rotas sensiveis, especialmente autenticação, devem ter controle de taxa para reduzir abuso.

### Justificativa

Mitigar forca bruta e uso abusivo.

### Aplicacao

- Cadastro de usuário
- Login
- Demais rotas conforme estrategia tecnica

## RN-030 - A API deve manter auditoria basica

### Regra

Entidades principais devem manter `createdAt` e `updatedAt`.

### Justificativa

Dar rastreabilidade basica ao sistema.

### Aplicacao

- Usuários
- Guildas

## RN-031 - Falhas de autorizacao devem bloquear a operacao sem efeito colateral

### Regra

Quando o usuário autenticado não atender aos requisitos de permissao, hierarquia ou pertencimento a guilda exigidos pela operacao, a API deve bloquear a acao e não pode produzir alteração parcial de estado.

### Justificativa

Garantir seguranca e integridade das regras de acesso.

### Aplicacao

- Cadastro de integrante
- Alteração de cargo
- Remocao de integrante
- Saida da guilda
- Delecao da guilda
- Delecao do proprio usuário

## RN-032 - Métodos HTTP não suportados devem ser rejeitados

### Regra

Quando um consumidor chamar uma rota existente com metodo HTTP não suportado, a API deve responder com `405 Method Not Allowed`.

### Justificativa

Deixar o contrato previsivel e evitar uso incorreto dos endpoints.

### Aplicacao

- Todos os endpoints da API

## RN-033 - Operacoes concorrentes devem ser atomicas e consistentes

### Regra

Em cenarios concorrentes, a API deve garantir consistencia transacional. Quando duas operacoes conflitantes tentarem alterar o mesmo estado de guilda ou integrante, apenas o fluxo que satisfizer as pre-condicoes no momento da escrita pode ser concluido; os demais devem falhar sem corromper dados.

### Justificativa

Evitar estados impossiveis, como dois lideres, promocao e remocao simultaneas inconsistentes, ou guilda removida parcialmente.

### Aplicacao

- Criacao de guilda
- Cadastro de integrante
- Alteração de cargo
- Remocao de integrante
- Saida da guilda
- Delecao de guilda
- Delecao de usuário

## RN-034 - Respostas de erro devem contemplar autenticação, autorizacao e seguranca

### Regra

Chamadas sem token, com token invalido, expirado ou com permissao insuficiente devem retornar codigos coerentes e nunca expor informacoes sensiveis.

### Justificativa

Padronizar o comportamento da API diante de falhas de seguranca.

### Aplicacao

- Todos os endpoints protegidos
