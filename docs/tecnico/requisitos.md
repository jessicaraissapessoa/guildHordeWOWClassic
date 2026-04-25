# Requisitos

## Requisitos funcionais

- Permitir cadastro de usuário.
- Permitir login com JWT.
- Permitir criacao e delecao de guilda.
- Permitir listagem paginada de guildas.
- Permitir cadastro de integrante na propria guilda por `Leader` e `Officer`.
- Permitir alteração da propria função.
- Permitir alteração de cargo apenas por `Leader`.
- Permitir remocao de integrante respeitando hierarquia.
- Permitir saida da guilda conforme as regras.
- Permitir listagem de usuários com filtros, paginacao e ordenacao.
- Permitir listagem de integrantes por guilda.
- Permitir delecao do proprio usuário.

## Requisitos não funcionais

- API REST em JSON.
- Implementacao com JavaScript, Node.js e Express.
- Persistencia em MySQL usando `mysql2`.
- Documentacao em Swagger/OpenAPI.
- Execucao inicial em ambiente local.
- Testes unitarios com Mocha e Chai.
- Testes de integracao/API com Mocha, Supertest, Chai e Mochawesome.
- Testes de performance com k6.
- Pipeline CI com GitHub Actions.
- Operacoes criticas devem ser transacionais e consistentes sob concorrencia.
- Rotas existentes devem rejeitar metodos HTTP não suportados com `405`.
- A API deve possuir cobertura planejada de testes de performance para cenarios criticos de leitura e escrita.

## Requisitos de seguranca

- Hash de senha com `bcrypt`.
- Autenticação JWT com `jsonwebtoken`.
- Rotas protegidas com middleware de autenticação.
- Revalidacao de permissao no banco nas operacoes protegidas.
- Rate limit nas rotas sensiveis.
- Não registrar senha em texto puro.
- Respostas de erro não devem expor dados sensiveis.
- Testes devem cobrir cenarios com token ausente, invalido, expirado e permissao insuficiente.
- Testes unitarios devem cobrir validadores, normalizacao, canonizacao de enums e regras puras de dominio.
- Testes de performance devem observar comportamento sob carga sem violar garantias de seguranca e integridade.
