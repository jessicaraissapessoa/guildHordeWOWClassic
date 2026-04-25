# User Stories

## US-001 - Cadastrar usuário

### Épico

EP-001 - Autenticação e Conta do Usuário

### História

Como visitante, quero criar uma conta para acessar os recursos da API.

### Critérios de aceite

- Deve validar obrigatoriedade, formato e unicidade de `username` e `characterName`.
- Deve validar `race`, `class` e `roleType`.
- Deve validar a combinação permitida entre `race`, `class` e `roleType`.
- Deve criar o usuário com `guildId = null` e `guildRank = null`.
- Deve armazenar a senha somente como hash.
- Não deve retornar senha nem hash na resposta.

## US-002 - Realizar login

### Épico

EP-001 - Autenticação e Conta do Usuário

### História

Como usuário cadastrado, quero autenticar-me para acessar recursos protegidos.

### Critérios de aceite

- Deve autenticar com `username` e `password`.
- Deve rejeitar credenciais inválidas.
- Deve retornar JWT assinado.
- O token deve identificar o usuário autenticado.
- Deve respeitar rate limit.
- Não deve expor em resposta detalhes sensíveis sobre a senha.

## US-003 - Deletar o próprio usuário

### Épico

EP-001 - Autenticação e Conta do Usuário

### História

Como usuário autenticado, quero deletar minha própria conta.

### Critérios de aceite

- Deve exigir autenticação.
- Deve permitir deleção apenas do próprio usuário autenticado.
- Se o usuário não for líder, a conta pode ser removida mesmo que esteja em guilda.
- Se o usuário for líder, a deleção deve ser bloqueada enquanto ele continuar líder.
- Requisições sem token, com token inválido ou expirado devem ser rejeitadas.

## US-004 - Criar guilda

### Épico

EP-002 - Ciclo de Vida da Guilda

### História

Como usuário autenticado sem guilda, quero criar uma guilda para liderá-la.

### Critérios de aceite

- Deve exigir autenticação.
- Deve aceitar somente `guildName` válido.
- Deve impedir criação se o usuário já estiver em uma guilda.
- Deve impedir nome de guilda duplicado.
- Deve cadastrar o autor como `Leader`.
- Requisições concorrentes para o mesmo nome de guilda não podem criar duplicidade.

## US-005 - Listar guildas

### Épico

EP-002 - Ciclo de Vida da Guilda

### História

Como usuário autenticado, quero listar as guildas do sistema.

### Critérios de aceite

- Deve exigir autenticação.
- Deve listar todas as guildas cadastradas.
- Deve suportar paginação.
- Deve suportar ordenação.
- Deve retornar ao menos nome da guilda, líder atual e quantidade de integrantes.

## US-006 - Deletar guilda

### Épico

EP-002 - Ciclo de Vida da Guilda

### História

Como líder, quero deletar a minha guilda quando eu decidir desfazê-la.

### Critérios de aceite

- Deve exigir autenticação.
- Deve exigir que o autor esteja em uma guilda.
- Deve permitir a ação apenas ao líder da própria guilda.
- Deve remover a guilda e deixar todos os integrantes com `guildId = null` e `guildRank = null`.
- Deve bloquear a operação para `Officer` e `Member`.
- Deve falhar sem efeito parcial em cenários concorrentes.

## US-007 - Listar integrantes de uma guilda

### Épico

EP-002 - Ciclo de Vida da Guilda

### História

Como usuário autenticado, quero consultar os integrantes de uma guilda para visualizar sua composição.

### Critérios de aceite

- Deve exigir autenticação.
- Deve receber `guildName`.
- A busca por `guildName` deve ser case-insensitive.
- Deve retornar nome do personagem, guilda, cargo, raça, classe e função dos integrantes.
- Deve rejeitar requisições sem token ou com token inválido.

## US-008 - Cadastrar integrante na guilda

### Épico

EP-003 - Gestão de Integrantes e Hierarquia

### História

Como líder ou oficial, quero adicionar um usuário sem guilda à minha guilda.

### Critérios de aceite

- Deve exigir autenticação.
- Deve permitir a ação somente para `Leader` ou `Officer`.
- O autor deve pertencer a uma guilda.
- O alvo deve existir e estar sem guilda.
- O alvo deve entrar automaticamente como `Member`.
- Deve bloquear `Member` e usuário sem guilda.
- Deve falhar sem duplicar entrada em cenários concorrentes.

## US-009 - Alterar cargo de integrante

### Épico

EP-003 - Gestão de Integrantes e Hierarquia

### História

Como líder, quero alterar o cargo de um integrante da minha guilda.

### Critérios de aceite

- Deve exigir autenticação.
- Deve permitir a ação somente para `Leader`.
- O alvo deve ser integrante da mesma guilda.
- Deve permitir `Officer`, `Member` e `Leader`.
- Ao transferir liderança, o líder atual deve passar automaticamente a `Member`.
- Deve bloquear `Officer`, `Member` e usuário fora da guilda do alvo.
- Deve impedir estados concorrentes com mais de um líder.

## US-010 - Remover integrante da guilda

### Épico

EP-003 - Gestão de Integrantes e Hierarquia

### História

Como integrante com permissão suficiente, quero remover integrantes de hierarquia inferior da minha guilda.

### Critérios de aceite

- Deve exigir autenticação.
- O autor deve pertencer a uma guilda.
- `Leader` pode remover `Officer` e `Member`.
- `Officer` pode remover apenas `Member`.
- Ninguém pode remover integrante de mesmo cargo ou cargo superior.
- `Leader` não pode remover a si mesmo.
- Deve bloquear requisições feitas por usuário sem guilda.
- Deve falhar sem efeito parcial em disputa concorrente com alteração de cargo ou deleção de guilda.

## US-011 - Sair da guilda

### Épico

EP-003 - Gestão de Integrantes e Hierarquia

### História

Como integrante de uma guilda, quero sair da guilda atual quando permitido pelas regras.

### Critérios de aceite

- Deve exigir autenticação.
- O usuário deve pertencer a uma guilda.
- Se não for líder, deve sair da guilda e ficar com `guildId = null` e `guildRank = null`.
- Se for líder, deve bloquear a saída enquanto ele ainda mantiver a liderança.
- Deve bloquear requisições sem token, com token inválido ou por usuário sem guilda.

## US-012 - Alterar a própria função

### Épico

EP-004 - Consulta e Manutenção de Dados de Domínio

### História

Como usuário autenticado, quero alterar minha própria função para manter meu personagem coerente com o que estou jogando.

### Critérios de aceite

- Deve exigir autenticação.
- Deve alterar apenas a função do próprio usuário autenticado.
- Deve validar a combinação resultante entre `race`, `class` e `roleType`.
- Deve rejeitar token ausente, inválido ou expirado.

## US-013 - Listar usuários

### Épico

EP-004 - Consulta e Manutenção de Dados de Domínio

### História

Como usuário autenticado, quero listar usuários do sistema com filtros para localizar personagens e integrantes.

### Critérios de aceite

- Deve exigir autenticação.
- Deve listar usuários com e sem guilda.
- Deve suportar filtros por `username`, `characterName`, `guildName`, `guildRank`, `race`, `class` e `roleType`.
- Deve suportar paginação.
- Deve suportar ordenação.
- Deve rejeitar métodos HTTP não suportados para a rota.
