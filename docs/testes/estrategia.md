# Estrategia de Testes

## Objetivo

Garantir que as regras de negocio, validacoes e endpoints principais funcionem corretamente.

## Stack de testes

- Mocha para testes unitarios e de integracao/API
- Chai para assercoes
- Supertest para chamadas HTTP nos testes de integracao/API
- Mochawesome para relatorio HTML/JSON da suite de API
- k6 para testes de performance

## Tipos de teste

### Unitarios

Testam funcoes puras, normalizacao, validadores, `AppError`, matriz de combinacoes `race + class + roleType` e regras de hierarquia.

### Integracao

Testam controllers, rotas, banco de dados, autenticação e fluxo entre camadas.

### API

Testam os endpoints via HTTP, cobrindo payload, status code, headers, seguranca e efeitos no banco.

### Performance

Testam tempo de resposta, estabilidade e comportamento sob carga nos endpoints mais relevantes da API.

## Prioridades de cobertura

- Cadastro e login
- Validacoes de `username`, `password`, `characterName` e `guildName`
- Unicidade case-insensitive
- Combinacoes validas de `race`, `class` e `roleType`
- Normalizacao de enums ignorando acentuacao
- Hierarquia `Leader > Officer > Member`
- Criacao e delecao de guilda
- Listagem de guildas
- Entrada e saida de integrantes
- Filtros, paginacao e ordenacao de `GET /users`
- Requisicoes sem autenticação, com token invalido e com token expirado
- Requisicoes com permissao insuficiente
- Métodos HTTP indevidos
- Comportamento esperado em concorrencia
- Respostas sem vazamento de informacoes sensiveis
- Performance de login, listagem de usuários e operacoes criticas de guilda

## Diretrizes

- Cada regra de negocio importante deve ter pelo menos um caso de teste.
- Regras puras e utilitarios devem preferencialmente ser cobertos por testes unitarios antes da cobertura integrada.
- Toda correcao de bug deve ganhar teste automatizado quando possivel.
- Testes de erro devem validar tanto o status code quanto o codigo padronizado de erro.
- Operacoes criticas devem ter cenarios que cubram revalidacao e concorrencia sempre que viavel.
- Endpoints protegidos devem ter cobertura minima para `401`, `403` e fluxo autorizado.
- Endpoints de escrita devem ter cenarios negativos para usuários sem requisito funcional da acao.
- Pelo menos uma rota por grupo funcional deve ter teste explicito de `405 Method Not Allowed`.
- Testes de performance devem ser isolados dos testes funcionais regulares para evitar falsos positivos.

## Performance

Escopo inicial recomendado:

- `POST /auth/login`
- `GET /users`
- `GET /guilds`
- `POST /guilds`
- `POST /guilds/members`
- `PATCH /guilds/members/{characterName}/rank`
- `DELETE /guilds/me`

Objetivos iniciais:

- medir latencia media e percentis sob carga controlada
- identificar regressao perceptivel entre versoes
- validar estabilidade sem erro funcional indevido
- observar impacto de concorrencia nas operacoes criticas

Indicadores sugeridos:

- tempo medio de resposta
- p95 e p99
- throughput
- taxa de erro
- consistencia final de dados apos carga

## Matriz minima esperada por endpoint protegido

- Sem token: `401`
- Token invalido ou expirado: `401`
- Usuário autenticado sem permissao: `403` quando aplicavel
- Método indevido: `405`
- Sucesso com efeito esperado
- Falha de regra de negocio sem efeito colateral

## Concorrencia

Os testes de concorrencia devem validar ao menos estes cenarios:

- duas criacoes simultaneas da mesma guilda
- transferencia de lideranca concorrendo com remocao do mesmo alvo
- delecao da guilda concorrendo com entrada ou saida de integrante
- promocao ou remocao concorrente do mesmo integrante

Resultado esperado:

- no maximo uma operacao conclui quando houver conflito direto
- o estado final permanece consistente
- não pode haver dois lideres na mesma guilda
- não pode haver usuário vinculado a guilda removida
