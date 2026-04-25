# Testes de Performance

## Objetivo

Definir como a API será exercitada com k6 em cenários de carga para observar latência, throughput, estabilidade e consistência.

## Como executar

Os casos de performance já estão implementados em scripts separados do `k6`, um por caso documentado.

Para executar a suíte completa, rode:

```bash
npm run test:performance
```

Por padrão, o runner sobe uma instância temporária da API na porta `3010`, com `rate limit` desabilitado apenas para a execução de performance. Em seguida, ele aponta os scripts `k6` para:

```text
http://localhost:3010
```

Para apontar para outra base URL já existente:

```bash
$env:BASE_URL="http://localhost:3001"
npm run test:performance
```

## Escopo inicial

Os primeiros testes de performance devem cobrir endpoints com maior relevância funcional ou maior risco de contenção:

- `POST /auth/login`
- `GET /users`
- `GET /guilds`
- `POST /guilds`
- `POST /guilds/members`
- `PATCH /guilds/members/{characterName}/rank`
- `DELETE /guilds/me`

## O que deve ser observado

- tempo médio de resposta
- percentis p95 e p99
- throughput
- taxa de erro
- consistência final do banco após a execução

## Cenários iniciais

### Carga leve

Validar baseline local da API em execução nominal.

### Carga sustentada

Validar estabilidade por uma janela contínua de tempo.

### Carga concorrente em operações críticas

Validar efeitos de disputa em criação de guilda, cadastro de integrante, alteração de cargo e deleção de guilda.

## Critérios qualitativos iniciais

- sem aumento abrupto de erros funcionais
- sem violação de regras de negócio
- sem estados inconsistentes ao final
- sem vazamento de informações sensíveis em respostas de erro sob carga

## Observações

- Como o projeto começa em ambiente local, os primeiros resultados servem como baseline e não como SLO definitivo.
- A ferramenta adotada para performance é o k6.
- Os scripts de performance devem ficar separados dos testes funcionais e versionados junto ao projeto.
- O comando `npm run test:performance` executa em sequência:
  - `test/performance/cpt-001-login.js`
  - `test/performance/cpt-002-listar-usuarios.js`
  - `test/performance/cpt-003-criar-guilda.js`
  - `test/performance/cpt-004-cadastrar-integrante.js`
  - `test/performance/cpt-005-alterar-cargo.js`
  - `test/performance/cpt-006-deletar-guilda.js`
- Os scripts usam somente HTTP contra a API em execução local.
- O runner de performance sobe uma instância temporária da API com `DISABLE_RATE_LIMIT=true` para evitar que o setup dos cenários seja bloqueado pelo rate limit de autenticação.
- Novos cenários devem evoluir sem misturar teste funcional e teste de carga na mesma execução.
