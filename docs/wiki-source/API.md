# API

## Rotas públicas

- `POST /auth/register`
- `POST /auth/login`

## Rotas protegidas

- `GET /users`
- `DELETE /users/me`
- `PATCH /users/me/role-type`
- `GET /guilds`
- `POST /guilds`
- `DELETE /guilds/me`
- `GET /guilds/{guildName}/members`
- `POST /guilds/members`
- `PATCH /guilds/members/{characterName}/rank`
- `DELETE /guilds/members/{characterName}`
- `POST /guilds/me/leave`

## Padrões da API

- autenticação via `Authorization: Bearer <token>`
- payloads e respostas em JSON
- filtros, paginação e ordenação em `GET /users`
- paginação e ordenação em `GET /guilds`
- erros padronizados para `400`, `401`, `403`, `404`, `405`, `409` e `429`

## Swagger

Com a API em execução local, a documentação interativa fica disponível em:

```text
http://localhost:3000/api-docs
```

## Referências detalhadas

- [docs/api/overview.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/api/overview.md)
- [docs/api/autenticacao.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/api/autenticacao.md)
- [docs/api/endpoints.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/api/endpoints.md)
- [docs/api/erros.md](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/api/erros.md)
- [docs/api/swagger/openapi.yaml](https://github.com/jessicaraissapessoa/guildHordeWOWClassic/blob/master/docs/api/swagger/openapi.yaml)
