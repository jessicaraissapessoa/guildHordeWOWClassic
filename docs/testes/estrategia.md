# Estratégia de Testes

## Objetivo

Garantir que as regras de negócio, validações e endpoints principais funcionem corretamente.

## Stack de testes

- Mocha para testes unitários e de integração/API
- Chai para asserções
- Supertest para chamadas HTTP nos testes de integração/API
- Mochawesome para relatório HTML/JSON da suíte de API
- k6 para testes de performance

## Tipos de teste

### Unitários

Testam funções puras, normalização, validadores, `AppError`, matriz de combinações `race + class + roleType` e regras de hierarquia.

### Integração

Testam controllers, rotas, banco de dados, autenticação e fluxo entre camadas.

### API

Testam os endpoints via HTTP, cobrindo payload, status code, headers, segurança e efeitos no banco.

### Performance

Testam tempo de resposta, estabilidade e comportamento sob carga nos endpoints mais relevantes da API.

## Prioridades de cobertura

- Cadastro e login
- Validações de `username`, `password`, `characterName` e `guildName`
- Unicidade case-insensitive
- Combinações válidas de `race`, `class` e `roleType`
- Normalização de enums ignorando acentuação
- Hierarquia `Leader > Officer > Member`
- Criação e deleção de guilda
- Listagem de guildas
- Entrada e saída de integrantes
- Filtros, paginação e ordenação de `GET /users`
- Requisições sem autenticação, com token inválido e com token expirado
- Requisições com permissão insuficiente
- Métodos HTTP indevidos
- Comportamento esperado em concorrência
- Respostas sem vazamento de informações sensíveis
- Performance de login, listagem de usuários e operações críticas de guilda

## Diretrizes

- Cada regra de negócio importante deve ter pelo menos um caso de teste.
- Regras puras e utilitários devem preferencialmente ser cobertos por testes unitários antes da cobertura integrada.
- Toda correção de bug deve ganhar teste automatizado quando possível.
- Testes de erro devem validar tanto o status code quanto o código padronizado de erro.
- Operações críticas devem ter cenários que cubram revalidação e concorrência sempre que viável.
- Endpoints protegidos devem ter cobertura mínima para `401`, `403` e fluxo autorizado.
- Endpoints de escrita devem ter cenários negativos para usuários sem requisito funcional da ação.
- Pelo menos uma rota por grupo funcional deve ter teste explícito de `405 Method Not Allowed`.
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

- medir latência média e percentis sob carga controlada
- identificar regressão perceptível entre versões
- validar estabilidade sem erro funcional indevido
- observar impacto de concorrência nas operações críticas

Indicadores sugeridos:

- tempo médio de resposta
- p95 e p99
- throughput
- taxa de erro
- consistência final de dados após carga

## Matriz mínima esperada por endpoint protegido

- Sem token: `401`
- Token inválido ou expirado: `401`
- Usuário autenticado sem permissão: `403` quando aplicável
- Método indevido: `405`
- Sucesso com efeito esperado
- Falha de regra de negócio sem efeito colateral

## Concorrência

Os testes de concorrência devem validar ao menos estes cenários:

- duas criações simultâneas da mesma guilda
- transferência de liderança concorrendo com remoção do mesmo alvo
- deleção da guilda concorrendo com entrada ou saída de integrante
- promoção ou remoção concorrente do mesmo integrante

Resultado esperado:

- no máximo uma operação conclui quando houver conflito direto
- o estado final permanece consistente
- não pode haver dois líderes na mesma guilda
- não pode haver usuário vinculado à guilda removida
