# Erros

## Padrao de resposta

Todas as respostas de erro devem seguir um contrato consistente.

Exemplo:

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "Request body is invalid.",
  "details": [
    {
      "field": "username",
      "message": "username must contain only lowercase letters, numbers, dot and underscore."
    }
  ],
  "timestamp": "2026-04-24T00:00:00.000Z",
  "path": "/auth/register"
}
```

## Codigos comuns

| Status | Codigo sugerido | Uso |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Payload, query ou parametro invalido |
| 401 | `UNAUTHORIZED` | Token ausente, invalido ou expirado |
| 403 | `FORBIDDEN` | Usuário autenticado sem permissao |
| 404 | `NOT_FOUND` | Usuário, guilda ou integrante não encontrado |
| 409 | `BUSINESS_RULE_CONFLICT` | Conflito de unicidade ou regra de negocio |
| 405 | `METHOD_NOT_ALLOWED` | Método HTTP não suportado para a rota |
| 429 | `RATE_LIMIT_EXCEEDED` | Limite de requisicoes excedido |
| 500 | `INTERNAL_SERVER_ERROR` | Erro inesperado |

## Diretrizes

- Não retornar senha nem hash em erros.
- Não expor stack trace em ambiente produtivo.
- Para erros de regra de negocio, preferir mensagens objetivas e estaveis.
- Para erros de validacao, retornar `details` com o campo afetado quando fizer sentido.
- Para `401`, evitar informar se o problema foi token ausente, token invalido ou token expirado em nivel excessivamente detalhado.
- Para `403`, deixar claro que o usuário autenticado não satisfaz os requisitos de permissao.
