# User Stories

## US-001 - Cadastrar usuário

### Epico

EP-001 - Autenticação e Conta do Usuário

### Historia

Como visitante, quero criar uma conta para acessar os recursos da API.

### Criterios de aceite

- Deve validar obrigatoriedade, formato e unicidade de `username` e `characterName`.
- Deve validar `race`, `class` e `roleType`.
- Deve validar a combinação permitida entre `race`, `class` e `roleType`.
- Deve criar o usuário com `guildId = null` e `guildRank = null`.
- Deve armazenar a senha somente como hash.
- Não deve retornar senha nem hash na resposta.

## US-002 - Realizar login

### Epico

EP-001 - Autenticação e Conta do Usuário

### Historia

Como usuário cadastrado, quero autenticar-me para acessar recursos protegidos.

### Criterios de aceite

- Deve autenticar com `username` e `password`.
- Deve rejeitar credenciais invalidas.
- Deve retornar JWT assinado.
- O token deve identificar o usuário autenticado.
- Deve respeitar rate limit.
- Não deve expor em resposta detalhes sensiveis sobre a senha.

## US-003 - Deletar o proprio usuário

### Epico

EP-001 - Autenticação e Conta do Usuário

### Historia

Como usuário autenticado, quero deletar minha propria conta.

### Criterios de aceite

- Deve exigir autenticação.
- Deve permitir delecao apenas do proprio usuário autenticado.
- Se o usuário não for líder, a conta pode ser removida mesmo que esteja em guilda.
- Se o usuário for líder, a delecao deve ser bloqueada enquanto ele continuar líder.
- Requisicoes sem token, com token invalido ou expirado devem ser rejeitadas.

## US-004 - Criar guilda

### Epico

EP-002 - Ciclo de Vida da Guilda

### Historia

Como usuário autenticado sem guilda, quero criar uma guilda para lidera-la.

### Criterios de aceite

- Deve exigir autenticação.
- Deve aceitar somente `guildName` valido.
- Deve impedir criacao se o usuário ja estiver em uma guilda.
- Deve impedir nome de guilda duplicado.
- Deve cadastrar o autor como `Leader`.
- Requisicoes concorrentes para o mesmo nome de guilda não podem criar duplicidade.

## US-005 - Deletar guilda

### Epico

EP-002 - Ciclo de Vida da Guilda

### Historia

Como líder, quero deletar a minha guilda quando eu decidir desfaze-la.

### Criterios de aceite

- Deve exigir autenticação.
- Deve exigir que o autor esteja em uma guilda.
- Deve permitir a acao apenas ao líder da propria guilda.
- Deve remover a guilda e deixar todos os integrantes com `guildId = null` e `guildRank = null`.
- Deve bloquear a operacao para `Officer` e `Member`.
- Deve falhar sem efeito parcial em cenarios concorrentes.

## US-006 - Listar integrantes de uma guilda

### Epico

EP-002 - Ciclo de Vida da Guilda

### Historia

Como usuário autenticado, quero consultar os integrantes de uma guilda para visualizar sua composicao.

### Criterios de aceite

- Deve exigir autenticação.
- Deve receber `guildName`.
- A busca por `guildName` deve ser case-insensitive.
- Deve retornar nome do personagem, guilda, cargo, raça, classe e função dos integrantes.
- Deve rejeitar requisicoes sem token ou com token invalido.

## US-007 - Cadastrar integrante na guilda

### Epico

EP-003 - Gestão de Integrantes e Hierarquia

### Historia

Como líder ou oficial, quero adicionar um usuário sem guilda a minha guilda.

### Criterios de aceite

- Deve exigir autenticação.
- Deve permitir a acao somente para `Leader` ou `Officer`.
- O autor deve pertencer a uma guilda.
- O alvo deve existir e estar sem guilda.
- O alvo deve entrar automaticamente como `Member`.
- Deve bloquear `Member` e usuário sem guilda.
- Deve falhar sem duplicar entrada em cenarios concorrentes.

## US-008 - Alterar cargo de integrante

### Epico

EP-003 - Gestão de Integrantes e Hierarquia

### Historia

Como líder, quero alterar o cargo de um integrante da minha guilda.

### Criterios de aceite

- Deve exigir autenticação.
- Deve permitir a acao somente para `Leader`.
- O alvo deve ser integrante da mesma guilda.
- Deve permitir `Officer`, `Member` e `Leader`.
- Ao transferir lideranca, o líder atual deve passar automaticamente a `Member`.
- Deve bloquear `Officer`, `Member` e usuário fora da guilda do alvo.
- Deve impedir estados concorrentes com mais de um líder.

## US-009 - Remover integrante da guilda

### Epico

EP-003 - Gestão de Integrantes e Hierarquia

### Historia

Como integrante com permissao suficiente, quero remover integrantes de hierarquia inferior da minha guilda.

### Criterios de aceite

- Deve exigir autenticação.
- O autor deve pertencer a uma guilda.
- `Leader` pode remover `Officer` e `Member`.
- `Officer` pode remover apenas `Member`.
- Ninguem pode remover integrante de mesmo cargo ou cargo superior.
- `Leader` não pode remover a si mesmo.
- Deve bloquear requisicoes feitas por usuário sem guilda.
- Deve falhar sem efeito parcial em disputa concorrente com alteração de cargo ou delecao de guilda.

## US-010 - Sair da guilda

### Epico

EP-003 - Gestão de Integrantes e Hierarquia

### Historia

Como integrante de uma guilda, quero sair da guilda atual quando permitido pelas regras.

### Criterios de aceite

- Deve exigir autenticação.
- O usuário deve pertencer a uma guilda.
- Se não for líder, deve sair da guilda e ficar com `guildId = null` e `guildRank = null`.
- Se for líder, deve bloquear a saida enquanto ele ainda mantiver a lideranca.
- Deve bloquear requisicoes sem token, com token invalido ou por usuário sem guilda.

## US-011 - Alterar a propria função

### Epico

EP-004 - Consulta e Manutencao de Dados de Dominio

### Historia

Como usuário autenticado, quero alterar minha propria função para manter meu personagem coerente com o que estou jogando.

### Criterios de aceite

- Deve exigir autenticação.
- Deve alterar apenas a função do proprio usuário autenticado.
- Deve validar a combinação resultante entre `race`, `class` e `roleType`.
- Deve rejeitar token ausente, invalido ou expirado.

## US-012 - Listar usuários

### Epico

EP-004 - Consulta e Manutencao de Dados de Dominio

### Historia

Como usuário autenticado, quero listar usuários do sistema com filtros para localizar personagens e integrantes.

### Criterios de aceite

- Deve exigir autenticação.
- Deve listar usuários com e sem guilda.
- Deve suportar filtros por `username`, `characterName`, `guildName`, `guildRank`, `race`, `class` e `roleType`.
- Deve suportar paginacao.
- Deve suportar ordenacao.
- Deve rejeitar metodos HTTP não suportados para a rota.
