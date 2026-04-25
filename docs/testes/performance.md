# Testes de Performance

## Objetivo

Definir como a API sera exercitada com k6 em cenarios de carga para observar latencia, throughput, estabilidade e consistencia.

## Escopo inicial

Os primeiros testes de performance devem cobrir endpoints com maior relevancia funcional ou maior risco de contencao:

- `POST /auth/login`
- `GET /users`
- `GET /guilds`
- `POST /guilds`
- `POST /guilds/members`
- `PATCH /guilds/members/{characterName}/rank`
- `DELETE /guilds/me`

## O que deve ser observado

- tempo medio de resposta
- percentis p95 e p99
- throughput
- taxa de erro
- consistencia final do banco apos a execucao

## Cenarios iniciais

### Carga leve

Validar baseline local da API em execucao nominal.

### Carga sustentada

Validar estabilidade por uma janela continua de tempo.

### Carga concorrente em operacoes criticas

Validar efeitos de disputa em criacao de guilda, cadastro de integrante, alteração de cargo e delecao de guilda.

## Criterios qualitativos iniciais

- sem aumento abrupto de erros funcionais
- sem violacao de regras de negocio
- sem estados inconsistentes ao final
- sem vazamento de informacoes sensiveis em respostas de erro sob carga

## Observacoes

- Como o projeto comeca em ambiente local, os primeiros resultados servem como baseline e não como SLO definitivo.
- A ferramenta adotada para performance e o k6.
- Os scripts de performance devem ficar separados dos testes funcionais e versionados junto ao projeto.
