# Requisitos

## Requisitos funcionais

- Permitir cadastro de usuário.
- Permitir login com JWT.
- Permitir criação e deleção de guilda.
- Permitir listagem paginada de guildas.
- Permitir cadastro de integrante na própria guilda por `Leader` e `Officer`.
- Permitir alteração da própria função.
- Permitir alteração de cargo apenas por `Leader`.
- Permitir remoção de integrante respeitando hierarquia.
- Permitir saída da guilda conforme as regras.
- Permitir listagem de usuários com filtros, paginação e ordenação.
- Permitir listagem de integrantes por guilda.
- Permitir deleção do próprio usuário.

## Requisitos não funcionais

- API REST em JSON.
- Implementação com JavaScript, Node.js e Express.
- Persistência em MySQL usando `mysql2`.
- Documentação em Swagger/OpenAPI.
- Execução inicial em ambiente local.
- Testes unitários com Mocha e Chai.
- Testes de integração/API com Mocha, Supertest, Chai e Mochawesome.
- Testes de performance com k6.
- Pipeline CI com GitHub Actions, previsto como etapa posterior.
- Operações críticas devem ser transacionais e consistentes sob concorrência.
- Rotas existentes devem rejeitar métodos HTTP não suportados com `405`.
- A API deve possuir cobertura planejada de testes de performance para cenários críticos de leitura e escrita.

## Requisitos de segurança

- Hash de senha com `bcrypt`.
- Autenticação JWT com `jsonwebtoken`.
- Rotas protegidas com middleware de autenticação.
- Revalidação de permissão no banco nas operações protegidas.
- Rate limit nas rotas sensíveis.
- Não registrar senha em texto puro.
- Respostas de erro não devem expor dados sensíveis.
- Testes devem cobrir cenários com token ausente, inválido, expirado e permissão insuficiente.
- Testes unitários devem cobrir validadores, normalização, canonização de enums e regras puras de domínio.
- Testes de performance devem observar comportamento sob carga sem violar garantias de segurança e integridade.
